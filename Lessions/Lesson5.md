### **Lesson 5: Adding Validation and Error Handling**

#### Objectives

1. Validate incoming data for your API endpoints.
2. Handle errors gracefully and provide meaningful responses.
3. Learn to use middleware for centralized error handling.

---

### **1. Add Validation**

For validating incoming data, we’ll use the `class-validator` package. It integrates well with TypeORM entities.

#### Step 1: Install Required Packages

Run the following command:

```bash
npm install class-validator class-transformer
```

#### Step 2: Update the `User` Entity

Add validation rules using `class-validator` decorators.

```typescript
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { IsEmail, IsNotEmpty, Length } from 'class-validator';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    @IsNotEmpty({ message: 'Name is required' })
    @Length(3, 50, { message: 'Name must be between 3 and 50 characters' })
    name!: string;

    @Column()
    @IsEmail({}, { message: 'Invalid email address' })
    email!: string;
}
```

#### Step 3: Validate Data in Routes

Use `class-validator` to validate incoming data in the `POST` and `PUT` routes.

Update `user.route.ts`:

```typescript
import { Router } from 'express';
import { User } from '../entity/User';
import AppDataSource from '../data-source';
import { validate } from 'class-validator';

const router = Router();
const userRepository = AppDataSource.getRepository(User);

// Create User
router.post('/', async (req, res) => {
    const { name, email } = req.body;
    const user = userRepository.create({ name, email });

    const errors = await validate(user);
    if (errors.length > 0) {
        return res.status(400).json(errors);
    }

    await userRepository.save(user);
    res.status(201).json(user);
});

// Update User
router.put('/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { name, email } = req.body;

    const user = await userRepository.findOneBy({ id });
    if (!user) return res.status(404).send('User not found');

    user.name = name;
    user.email = email;

    const errors = await validate(user);
    if (errors.length > 0) {
        return res.status(400).json(errors);
    }

    await userRepository.save(user);
    res.json(user);
});
```

---

### **2. Add Centralized Error Handling**

Errors should be handled consistently across all routes. We’ll use an Express error-handling middleware.

#### Step 1: Create an Error Middleware

Add `src/middleware/error.middleware.ts`:

```typescript
import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    console.error(err.stack);

    res.status(err.status || 500).json({
        error: {
            message: err.message || 'Internal Server Error',
        },
    });
}
```

#### Step 2: Update `app.ts`

Add the error middleware at the end of the middleware stack:

```typescript
import express from 'express';
import homeRoute from './routes/home.route';
import userRoute from './routes/user.route';
import logger from './middleware/logger.middleware';
import { errorHandler } from './middleware/error.middleware';

const app = express();

// Middleware
app.use(logger);
app.use(express.json());

// Routes
app.use('/', homeRoute);
app.use('/users', userRoute);

// Error Handling Middleware
app.use(errorHandler);

export default app;
```

---

### **3. Test the Validation and Error Handling**

#### Validation Tests

1. **POST `/users` with Invalid Data**:

```json
{
    "name": "",
    "email": "not-an-email"
}
```

   Expected Response:

```json
[
    {
        "target": {
            "name": "",
            "email": "not-an-email"
        },
        "property": "name",
        "constraints": {
            "isNotEmpty": "Name is required",
            "length": "Name must be between 3 and 50 characters"
        }
    },
    {
        "target": {
            "name": "",
            "email": "not-an-email"
        },
        "property": "email",
        "constraints": {
            "isEmail": "Invalid email address"
        }
    }
]
```

2. **POST `/users` with Valid Data**:

```json
{
    "name": "John Doe",
    "email": "john.doe@example.com"
}
```

   Expected Response:

```json
{
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com"
}
```

#### Add a 404 Catch-All Middleware

1. Add this middleware after your route definitions but before the error handler in app.ts:

```bash
app.use((req, res, next) => {
 res.status(404).json({
     error: {
             message: 'Not Found',
         },
     });
 });
```

2. Update app.ts

```ts
    import express from 'express';
    import homeRoute from './routes/home.route';
    import userRoute from './routes/user.route';
    import logger from './middleware/logger.middleware';
    import { errorHandler } from './middleware/error.middleware';
    
    const app = express();
    
    // Middleware
    app.use(logger);
    app.use(express.json());
    
    // Routes
    app.use('/', homeRoute);
    app.use('/users', userRoute);
    
    // 404 Catch-All Middleware
    app.use((req, res, next) => {
        res.status(404).json({
            error: {
                message: 'Not Found',
            },
        });
    });
    
    // Error Handling Middleware
    app.use(errorHandler);
    
    export default app;
```

3. Trigger a 404 error by accessing an undefined route:

```bash
   GET /undefined-route
```

   Expected Response:

```json
   {
       "error": {
           "message": "Not Found"
        }
   }
```

4. Simulate a server error in any route by throwing an error:

```typescript
throw new Error('Simulated error');
```

   Expected Response:

```json
{
    "error": {
        "message": "Simulated error"
    }
}
```

---

### **What You Learned in Lesson 5**

- Added validation using `class-validator` to ensure data integrity.
- Implemented centralized error handling for better consistency.
- Used middleware to separate concerns and keep the code clean.

---

### **Assignment**

1. Add validation for the `Product` entity (from Lesson 4) with:
   - A `name` field that is required and at least 3 characters long.
   - A `price` field that is required and a positive number.
2. Update the `POST` and `PUT` routes for `Product` to include validation.
3. Test validation and error handling for `Product`.
