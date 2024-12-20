### **Lesson 4: Connecting Your Backend to a Database**

#### Objectives

1. Set up a database connection using SQLite.
2. Define and interact with a database entity.
3. Perform CRUD (Create, Read, Update, Delete) operations.

---

### **1. Install and Configure SQLite**

SQLite is a lightweight, file-based database that requires no additional setup. It’s perfect for learning and small projects.

#### Step 1: Install SQLite and TypeORM

Run the following commands to add the required packages:

```bash
npm install typeorm sqlite3 reflect-metadata
```

#### Step 2: Update `tsconfig.json`

Ensure that the following options are enabled in your `tsconfig.json` file:

```json
{
  "compilerOptions": {
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true
  }
}
```

#### Step 3: Create a Database Configuration File

Create `src/data-source.ts`:

```typescript
import { DataSource } from 'typeorm';

const AppDataSource = new DataSource({
    type: 'sqlite',
    database: 'database.sqlite',
    synchronize: true,
    logging: true,
    entities: ['src/entity/*.ts'],
});

export default AppDataSource;
```

- `database.sqlite` will be the file that stores your data.
- `synchronize: true` automatically updates the database schema to match your entities (useful for development).

#### Step 4: Initialize the Data Source in `index.ts`

Modify `src/index.ts` to initialize the database:

```typescript
import 'reflect-metadata';
import AppDataSource from './data-source';
import app from './app';

const port = 3000;

AppDataSource.initialize()
    .then(() => {
        console.log('Database connected!');
        app.listen(port, () => {
            console.log(`Server is running at http://localhost:${port}`);
        });
    })
    .catch((error) => console.error('Database connection failed:', error));
```

---

### **2. Define a Database Entity**

1. Create an `entity` folder in `src/`.
2. Create `src/entity/User.ts`:

   ```typescript
   import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

   @Entity()
   export class User {
       @PrimaryGeneratedColumn()
       id: number;

       @Column()
       name: string;

       @Column()
       email: string;
   }
   ```

   - `@Entity()`: Marks the class as a database table.
   - `@PrimaryGeneratedColumn()`: Auto-increment primary key.
   - `@Column()`: Defines a database column.

---

### **3. Create CRUD Routes**

#### Step 1: Create a User Route

Create `src/routes/user.route.ts`:

```typescript
import { Router } from 'express';
import { User } from '../entity/User';
import AppDataSource from '../data-source';

const router = Router();
const userRepository = AppDataSource.getRepository(User);

// Create User
router.post('/', async (req, res) => {
    const { name, email } = req.body;
    const user = userRepository.create({ name, email });
    await userRepository.save(user);
    res.status(201).json(user);
});

// Read Users
router.get('/', async (req, res) => {
    const users = await userRepository.find();
    res.json(users);
});

// Update User
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;
    const user = await userRepository.findOneBy({ id: Number(id) });
    if (!user) return res.status(404).send('User not found');
    user.name = name;
    user.email = email;
    await userRepository.save(user);
    res.json(user);
});

// Delete User
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const result = await userRepository.delete(Number(id));
    if (result.affected === 0) return res.status(404).send('User not found');
    res.status(204).send();
});

export default router;
```

#### Step 2: Add the User Route to `app.ts`

Update `src/app.ts`:

```typescript
import express from 'express';
import homeRoute from './routes/home.route';
import userRoute from './routes/user.route';
import logger from './middleware/logger.middleware';

const app = express();

// Middleware
app.use(logger);
app.use(express.json());

// Routes
app.use('/', homeRoute);
app.use('/users', userRoute);

export default app;
```

---

### **4. Test the Endpoints**

Use a tool like Postman or Insomnia to test the endpoints:

- **POST /users**: Create a user.

  ```json
  {
      "name": "John Doe",
      "email": "john.doe@example.com"
  }
  ```

- **GET /users**: Retrieve all users.
- **PUT /users/:id**: Update a user.
- **DELETE /users/:id**: Delete a user.

---

### **What You Learned in Lesson 4**

- Installed and configured SQLite.
- Used TypeORM to connect to a database and define entities.
- Performed CRUD operations via RESTful APIs.

---

### **Assignment**

1. Add another entity, `Product`, with fields like `id`, `name`, and `price`.
2. Create routes to perform CRUD operations for the `Product` entity.
