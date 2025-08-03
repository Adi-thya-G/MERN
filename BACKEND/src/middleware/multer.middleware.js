import multer from 'multer';
import { fileURLToPath } from 'url';
import path from 'path';

// Fix: define __filename and __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set up multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'public', 'temp')); // ✅ uploads go to backend/public/temp
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // optionally use unique naming
  }
});

export const upload = multer({ storage });
