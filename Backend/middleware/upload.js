import multer, { diskStorage } from "multer";
import { extname } from "path";

const storage = diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/servicios'),
    filename: (req, file, cb) =>
        cb(null, Date.now() + extname(file.originalname))
});

const upload = multer({ storage });
export default upload;