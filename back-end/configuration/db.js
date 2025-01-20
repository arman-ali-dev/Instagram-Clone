const { connect } = require("mongoose");

const connectDB = async () => {
  const conn = await connect(
    "mongodb+srv://Armanali:arman5911@instagram.sfjsa.mongodb.net/Instagram"
  );

  return conn;
};

module.exports = connectDB;
