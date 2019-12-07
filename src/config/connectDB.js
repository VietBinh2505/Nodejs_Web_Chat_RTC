import mongoose from 'mongoose';
import bluebird from 'bluebird';
import database from "./database"
// connect to mongoodb
let connectDB = () => {
	mongoose.Promise = bluebird;
	//let URI = `${database.DB_Connection}://${database.DB_Host}:${database.DB_Post}/${database.DB_Name}`;
	let URI = `mongodb+srv://webchat:webchat@cluster0-guetz.mongodb.net/test`;
	return mongoose.connect(URI, { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true });
};

module.exports = connectDB;