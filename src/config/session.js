import session from "express-session";
import connectmongo from "connect-mongo";
import database from "./database";
let mongostore = connectmongo(session);
let sessionStore = new mongostore({
    url: `${database.DB_Connection}://${database.DB_Host}:${database.DB_Post}/${database.DB_Name}`,
    autoReconnect: true,
    //autoRemove: "native", // Khi hết thơi gian của sesion tự độg xóa trong csdl
});

let config = (app) => {
    app.use(session({
        key: database.key,
        secret: database.secret,
        store: sessionStore,
        resave: true,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 //1 ngày
        }
    }));
};
module.exports = {
    config: config,
    sessionStore: sessionStore,
};