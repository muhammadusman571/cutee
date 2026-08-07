module.exports = {
  //Port
  PORT: 5001,

  //Mongodb string
  // mongoDbConnectionString: "mongodb+srv://drcadil388_db_user:9UKlZiCwlyINvPB7@cluster0.h2ntw66.mongodb.net/rashad"
  mongoDbConnectionString: process.env.MONGO_URI,
};
