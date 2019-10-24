import session from "express-session";
import connectmongo from "connect-mongo";
import database from "./database";
let mongostore = connectmongo(session);
let sessionstore = new mongostore({
        url: `${database.DB_Connection}://${database.DB_Host}:${database.DB_Post}/${database.DB_Name}`,
        autoReconnect: true,
        //autoRemove: "native", // Khi hết thơi gian của sesion tự độg xóa trong csdl
    })
    /**
     * 
     * @param app 
     */
let configSession = (app) => {
    app.use(session({
        key: "express.sid",
        secret: "mySecret",
        store: sessionstore,
        resave: true,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 //1 ngày
        }
    }))
};
module.exports = configSession;