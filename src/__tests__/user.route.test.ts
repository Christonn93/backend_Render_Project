import request from 'supertest';
import { app } from '../app';
import AppDataSource from '../data-source';

beforeAll(async () => {
    if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
    }
});

afterAll(async () => {
    if (AppDataSource.isInitialized) {
        await AppDataSource.destroy();
    }
});

describe('User Routes', () => {
    it('should create a new user', async () => {
        const response = await request(app).post('/users').send({
            name: 'John Doe',
            email: 'john.doe@example.com',
            password: 'password123',
            role: 'user',
        });

        expect(response.status).toBe(201);
        expect(response.body.name).toBe('John Doe');
        expect(response.body.email).toBe('john.doe@example.com');
    });

    it('should fetch all users', async () => {
        const response = await request(app).get('/users');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return 404 for non-existent route', async () => {
        const response = await request(app).get('/non-existent-route');
        expect(response.status).toBe(404);
    });
});
