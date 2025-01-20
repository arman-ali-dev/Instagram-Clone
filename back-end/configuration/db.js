const { connect } = require("mongoose");

const connectDB = async () => {
  const conn = await connect(process.env.MONGO_URI);

  return conn;
};

module.exports = connectDB;
