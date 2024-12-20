import { Router } from 'express';
import { getSystemMetrics } from '../utils/monitoring';

const router = Router();

// System Metrics Endpoint
router.get('/metrics', (req, res) => {
    const metrics = getSystemMetrics();
    res.json(metrics);
});

export default router;
