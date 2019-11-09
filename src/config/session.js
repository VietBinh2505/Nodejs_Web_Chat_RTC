import session from 'express-session';
import connectMongo from 'connect-mongo';
import database from "./database";
let MongoStore = connectMongo(session);

/**
 * this variable is where save session, in this case is mongo
 */
let sessionStore = new MongoStore({
  url: `${database.DB_Connection}://${database.DB_Host}:${database.DB_Post}/${database.DB_Name}`,
  autoReconnect: true,
  // autoRemove: 'native'
})

let config = app => {
  app.use(session({
    key:  database.key,
    secret: database.secret,
    store: sessionStore,
    resave: true,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24
    }
  }));
};

module.exports = {
  config,
  sessionStore
};