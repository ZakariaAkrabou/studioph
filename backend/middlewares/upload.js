const multer = require("multer");
const streamifier = require("streamifier");
const cloudinary = require("../config/cloudinary");

const storage = multer.memoryStorage();
const upload = multer({ storage });

exports.singleUpload = (fieldName, folder) => [
  upload.single(fieldName),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return next();
      }

      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder },
          (err, res) => (err ? reject(err) : resolve(res))
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });

      req.file.cloudinaryUrl = result.secure_url;
      next();
    } catch (err) {
      next(err);
    }
  },
];

exports.multipleUpload = (fieldName, maxCount, folder) => [
  upload.array(fieldName, maxCount),
  async (req, res, next) => {
    try {
      if (!req.files || req.files.length === 0)
        return next(new Error("No files uploaded"));

      const uploadPromises = req.files.map(
        (file) =>
          new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              { folder },
              (err, res) => (err ? reject(err) : resolve(res))
            );
            streamifier.createReadStream(file.buffer).pipe(stream);
          })
      );

      const results = await Promise.all(uploadPromises);
      req.files = results.map((r) => r.secure_url);
      next();
    } catch (err) {
      next(err);
    }
  },
];
