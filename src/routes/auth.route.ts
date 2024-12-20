import { Router, Request, Response } from 'express';
import { User } from '../entity/User';
import AppDataSource from '../data-source';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router();
const userRepository = AppDataSource.getRepository(User);

router.post('/register', async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    // Check if the email is already in use
    const existingUser = await userRepository.findOneBy({ email });
    if (existingUser) {
        res.status(400).json({ message: 'Email is already in use' });
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

router.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // Find the user by email
    const user = await userRepository.findOneBy({ email });
    if (!user) {
        res.status(404).json({ message: 'Invalid email or password' });
        return;
    }
    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate a JWT token
    const token = jwt.sign(
        { id: user.id, role: user.role },
        'your_jwt_secret', // Replace with an environment variable in production
        { expiresIn: '1h' }
    );

    res.json({ token });
});

export default router;
