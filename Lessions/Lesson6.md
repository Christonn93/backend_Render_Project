### **Lesson 6: Authentication and Authorization**

#### Objectives

1. Implement user authentication using JSON Web Tokens (JWT).
2. Protect routes with middleware to restrict access to authenticated users.
3. Add role-based authorization for user management.

---

### **1. Install Required Packages**

Run the following command to install authentication-related libraries:

```bash
npm install jsonwebtoken bcryptjs
npm install @types/jsonwebtoken @types/bcryptjs --save-dev
```

- **jsonwebtoken**: Used for creating and verifying JWT tokens.
- **bcryptjs**: Used for hashing and verifying passwords.

---

### **2. Add Authentication to the User Entity**

Update the `User` entity to include a password field.

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

    @Column({ unique: true })
    @IsEmail({}, { message: 'Invalid email address' })
    email!: string;

    @Column()
    @IsNotEmpty({ message: 'Password is required' })
    password!: string;

    @Column({ default: 'user' })
    role!: string; // e.g., "user" or "admin"
}
```

---

### **3. Implement User Registration**

Add a registration route to handle user sign-up with hashed passwords.

#### Registration Route

Update or create `auth.route.ts`:

```typescript
import { Router } from 'express';
import { User } from '../entity/User';
import AppDataSource from '../data-source';
import bcrypt from 'bcryptjs';

const router = Router();
const userRepository = AppDataSource.getRepository(User);

router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    // Check if the email is already in use
    const existingUser = await userRepository.findOneBy({ email });
    if (existingUser) {
        return res.status(400).json({ message: 'Email is already in use' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = userRepository.create({
        name,
        email,
        password: hashedPassword,
    });

    await userRepository.save(user);
    res.status(201).json({ message: 'User registered successfully' });
});

export default router;
```

---

### **4. Implement User Login**

Add a login route that generates a JWT token for authenticated users.

#### Login Route

Update `auth.route.ts`:

```typescript
import jwt from 'jsonwebtoken';

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Find the user by email
    const user = await userRepository.findOneBy({ email });
    if (!user) {
        return res.status(404).json({ message: 'Invalid email or password' });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate a JWT token
    const token = jwt.sign(
        { id: user.id, role: user.role },
        'your_jwt_secret', // Replace with an environment variable in production
        { expiresIn: '1h' }
    );

    res.json({ token });
});
```

---

### **5. Protect Routes with Middleware**

Create middleware to verify JWT tokens and restrict access to authenticated users.

#### Authentication Middleware

Create `src/middleware/auth.middleware.ts`:

```typescript
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access Denied' });
    }

    try {
        const decoded = jwt.verify(token, 'your_jwt_secret'); // Use an environment variable in production
        (req as any).user = decoded; // Attach user info to the request
        next();
    } catch (err) {
        res.status(403).json({ message: 'Invalid Token' });
    }
}
```

---

### **6. Add Role-Based Authorization**

Restrict certain routes to specific roles, such as "admin".

#### Authorization Middleware

Update `auth.middleware.ts`:

```typescript
export function authorizeRoles(...allowedRoles: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user;

        if (!allowedRoles.includes(user.role)) {
            return res.status(403).json({ message: 'Forbidden: Insufficient Permissions' });
        }

        next();
    };
}
```

---

### **7. Protect a Route**

Example of a protected route in `user.route.ts`:

```typescript
import { authenticateToken, authorizeRoles } from '../middleware/auth.middleware';

router.get('/admin', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    res.json({ message: 'Welcome Admin!' });
});
```

---

### **8. Test the Authentication and Authorization**

#### **Registration**

- **POST `/auth/register`** with:

  ```json
  {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "password": "password123"
  }
  ```

#### **Login**

- **POST `/auth/login`** with:

  ```json
  {
    "email": "john.doe@example.com",
    "password": "password123"
  }
  ```

  - You should receive a token.

#### **Access Protected Routes**

- Use the token as a Bearer Token in the Authorization header:

  ```
  Authorization: Bearer <your_token>
  ```

---

### **What You Learned in Lesson 6**

- Added JWT-based authentication for secure login.
- Protected routes using authentication middleware.
- Implemented role-based authorization for fine-grained access control.

---

### **Assignment**

1. Add role-based access to CRUD operations in the `/products` routes:
   - Only "admin" can create, update, or delete products.
   - Both "admin" and "user" can view products.
2. Secure `/users` routes so only authenticated users can access them.
3. Test all scenarios (e.g., invalid token, no token, unauthorized access).
