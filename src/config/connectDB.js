import mongoose from "mongoose";
import blubird from "bluebird";
import database from "./database";
let connectDB = () => {
    mongoose.Promise = blubird;
    let URI = `${database.DB_Connection}://${database.DB_Host}:${database.DB_Post}/${database.DB_Name}`;

    return mongoose.connect(URI, { useMongoClient: true });
}

module.exports = connectDB;