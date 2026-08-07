const { S3Client } = require("@aws-sdk/client-s3");
const config = require("../config.js");
const s3Client = new S3Client({
  region: config.s3Region || "ap-south-1",
  credentials: {
    accessKeyId: config.s3AccessKeyId,
    secretAccessKey: config.s3SecretKey,
  },
});

module.exports = s3Client;
