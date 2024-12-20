import multer from 'multer';
import path from 'path';

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName); 
    },
});

// File validation
const fileFilter = (req: any, file: any, cb: any) => {
    const allowedExtensions = ['.png', '.jpg', '.jpeg', '.gif'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowedExtensions.includes(ext)) {
        return cb(new Error('Only image files are allowed'));
    }
    cb(null, true);
};

// Limit file size to 2MB
const limits = {
    fileSize: 2 * 1024 * 1024, 
};

export const upload = multer({ storage, fileFilter, limits });
