const { DeleteObjectsCommand } = require("@aws-sdk/client-s3");
const s3Client = require("./s3Client");
const config = require("../config");

/**
 * Extract S3 key from various inputs
 */
const extractKey = (input) => {
  if (!input) return null;

  // multer-s3 file object
  if (typeof input === "object" && !Array.isArray(input)) {
    if (input.key) return input.key;

    if (input.location) {
      const url = new URL(input.location);
      return decodeURIComponent(url.pathname.slice(1));
    }
  }

  // string input (key or URL)
  if (typeof input === "string") {
    if (input.startsWith("http")) {
      const url = new URL(input);
      return decodeURIComponent(url.pathname.slice(1));
    }
    return input;
  }

  return null;
};

/**
 * Recursively collect S3 keys from any structure
 */
const collectKeys = (input, keys = []) => {
  if (!input) return keys;

  if (Array.isArray(input)) {
    input.forEach((item) => collectKeys(item, keys));
    return keys;
  }

  if (typeof input === "object") {
    Object.values(input).forEach((value) =>
      collectKeys(value, keys)
    );
    return keys;
  }

  const key = extractKey(input);
  if (key) keys.push(key);

  return keys;
};

/**
 * Deletes object(s) from S3 using batch delete
 */
const deleteFromS3 = async (input) => {
  if (!input) return;

  // Collect + deduplicate keys
  const keys = [...new Set(collectKeys(input))];

  if (keys.length === 0) return;

  // AWS allows max 1000 objects per DeleteObjects call
  const chunkSize = 1000;

  for (let i = 0; i < keys.length; i += chunkSize) {
    const chunk = keys.slice(i, i + chunkSize);

    await s3Client.send(
      new DeleteObjectsCommand({
        Bucket: config.s3BucketName,
        Delete: {
          Objects: chunk.map((Key) => ({ Key })),
          Quiet: true,
        },
      })
    );
  }
};

module.exports = {
  deleteFromS3,
};
