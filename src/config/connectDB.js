import mongoose from 'mongoose';
import bluebird from 'bluebird';
import database from "./database"
// connect to mongoodb
let connectDB = () => {
  mongoose.Promise = bluebird;
  let URI = `${database.DB_Connection}://${database.DB_Host}:${database.DB_Post}/${database.DB_Name}`;

  return mongoose.connect(URI, {useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false});
};

module.exports = connectDB;