import { Router, Request, Response } from 'express';
import { upload } from '../middleware/upload.middleware';

const router = Router();

// Single File Upload
router.post('/upload', upload.single('file'), (req: Request, res: Response) => {
    if (!req.file) {
        res.status(400).json({ message: 'No file uploaded' });
    }
    res.status(201).json({
        message: 'File uploaded successfully',
        file: req.file,
    });
});

export default router;
