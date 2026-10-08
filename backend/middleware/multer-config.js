const multer = require('multer');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp'
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const name = file.originalname
      .split('.')[0]
      .replace(/[^a-zA-Z0-9_-]/g, '_');

    const extension = MIME_TYPES[file.mimetype];

    callback(null, `${name}_${Date.now()}.${extension}`);
  }
});

module.exports = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, callback) => {
    if (!MIME_TYPES[file.mimetype]) {
      return callback(new Error('Format d’image non autorisé'));
    }

    callback(null, true);
  }
}).single('image');