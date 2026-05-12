// middlewares/upload.middleware.js
import multer  from 'multer';
import path    from 'node:path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/servicios/'),
  filename:    (req, file, cb) => {
    const ext    = path.extname(file.originalname);
    const nombre = `servicio-${Date.now()}${ext}`;
    cb(null, nombre);
  },
});

const fileFilter = (req, file, cb) => {
  const permitidos = ['image/jpeg', 'image/png', 'image/webp'];
  permitidos.includes(file.mimetype)
    ? cb(null, true)
    : cb(new Error('Solo se permiten imágenes JPG, PNG o WEBP'));
};

export const upload = multer({ storage, fileFilter, limits: { fileSize: 2 * 1024 * 1024 } }); // 2MB