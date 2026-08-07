module.exports = {
  PORT: process.env.PORT || 5000,
  projectName: process.env.PROJECT_NAME || "FittoLive",
  Production: process.env.PRODUCTION === "true",
  EMAIL: process.env.EMAIL,
  JWT_SECRET: process.env.JWT_SECRET,
  secretKey: process.env.SECRET_KEY,
  baseURL: process.env.BASE_URL,
  AGENCY_PATH: process.env.AGENCY_PATH,
  HOST_PATH: process.env.HOST_PATH,
  //Mongodb string
  // MongoDb_Connection_String: "mongodb+srv://drcadil388_db_user:9UKlZiCwlyINvPB7@cluster0.h2ntw66.mongodb.net/rashad"
  MongoDb_Connection_String: process.env.MONGO_URI,

  s3BucketName: process.env.AWS_S3_BUCKET_NAME,
  s3SecretKey: process.env.AWS_SECRET_ACCESS_KEY,
  s3AccessKeyId: process.env.AWS_ACCESS_KEY_ID,
  s3Region: process.env.AWS_REGION,

  type: process.env.GOOGLE_TYPE,
  project_id: process.env.GOOGLE_PROJECT_ID,
  private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
  private_key: process.env.GOOGLE_PRIVATE_KEY,
  client_email: process.env.GOOGLE_CLIENT_EMAIL,
  client_id: process.env.GOOGLE_CLIENT_ID,
  auth_uri: process.env.GOOGLE_AUTH_URI,
  token_uri: process.env.GOOGLE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.GOOGLE_CLIENT_X509_CERT_URL,
  universe_domain: process.env.GOOGLE_UNIVERSE_DOMAIN,
};
