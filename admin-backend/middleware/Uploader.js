const config = require("../config");
const s3Uploader = require("../middleware/s3Uploader");
const multer = require("multer");

const uploader = (storage) => {
  const upload = multer({ storage });
  if (config.projectName === "FittoLive") {
    return upload;
  } else {
    return s3Uploader;
  }
};

module.exports = uploader;
