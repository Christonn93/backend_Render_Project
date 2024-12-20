import { Router, Request, Response } from 'express';
import { User } from '../entity/User';
import AppDataSource from '../data-source';
import { validate } from 'class-validator';
import { UserTypes } from '../types/user.types';

const router = Router();
const userRepository = AppDataSource.getRepository(User);

// Create User
router.post('/', async (req: Request, res: Response) => {
    const { name, email, password, role } = req.body;
    const user = userRepository.create({ name, email, password, role });

    const errors = await validate(user);
    if (errors.length > 0) {
        res.status(400).json(errors);
    }

    await userRepository.save(user);
    res.status(201).json(user);
});

// Read Users
router.get('/', async (req: Request, res: Response) => {
    const users = await userRepository.find();
    res.json(users);
});

// Update User
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id, 10);
        const { name, email, password, role } = req.body;

        const user = await userRepository.findOneBy({ id });
        if (!user) {
            res.status(404).send('User not found');
            return;
        }

        user.name = name;
        user.email = email;
        user.password = password;
        user.role = role;

        const errors = await validate(user);
        if (errors.length > 0) {
            res.status(400).json(errors);
            return;
        }

        await userRepository.save(user);
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error', error });
    }
});

// Delete User
router.delete('/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);

    const result = await userRepository.delete(id);
    if (result.affected === 0) res.status(404).send('User not found');

    res.status(204).send();
});

export default router;
