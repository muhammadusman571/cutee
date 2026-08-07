const multer = require("multer");
const multerS3 = require("multer-s3");
const s3Client = require("../util/s3Client");

const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
  "video/mp4",

  // SVGA (non-standard)
  "application/octet-stream",
  "application/x-svga",
];

const allowedExtensions = [
  "jpg",
  "jpeg",
  "png",
  "webp",
  "gif",
  "pdf",
  "svga",
  "mp4",
];

const s3Uploader = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: process.env.AWS_S3_BUCKET_NAME, // cute-live-s3bucket
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      const ext = file.originalname.split(".").pop().toLowerCase();

      let folder = "others";
      if (["jpg", "jpeg", "png", "webp", "gif"].includes(ext)) {
        folder = "images";
      } else if (ext === "svga") {
        folder = "svga";
      } else if (ext === "pdf") {
        folder = "docs";
      } else if (ext === "mp4") {
        folder = "videos";
      }

      const filename = `${Date.now()}-${Math.round(
        Math.random() * 1e9
      )}.${ext}`;

      cb(null, `uploads/${folder}/${filename}`);
    },
  }),
  limits: {
     fileSize: 50 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const mimeAllowed = allowedMimeTypes.includes(file.mimetype);

    const ext = (file.originalname.split(".").pop() || "").toLowerCase();
    const extAllowed = allowedExtensions.includes(ext);

    if (!mimeAllowed || !extAllowed) {
      return cb(new Error("Unsupported file type"), false);
    }

    cb(null, true);
  },
});

module.exports = s3Uploader;
