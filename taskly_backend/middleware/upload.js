import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: 'taskly_user',
      // Only apply transformation to images
      ...(file.mimetype.startsWith('image/') && {
        transformation: [{ width: 500, height: 500, crop: 'limit' }],
      }),
    };
  },
});

// Limit file size to 10MB
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  // No fileFilter, allow all types
});

export default upload;
