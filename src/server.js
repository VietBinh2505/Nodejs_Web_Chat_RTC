import express from 'express';
import ConnectDB from './config/connectDB';
import configViewEngine from './config/viewEngine';
import initRoutes from './routes/web';
import bodyParser from 'body-parser';
import connectFlash from 'connect-flash';
import session from './config/session';
import passport from 'passport';
import http from 'http';
import socketio from 'socket.io';
import initSocket from './sockets/index';
import database from './config/database';
import cookieParser from 'cookie-parser';
import configSocketio from './config/socketio';
import events from "events";

// init app
let app = express();

// init server with socket.io & express app
let server = http.createServer(app);
let io = socketio(server);
events.EventEmitter.defaultMaxListeners = database.defaultMaxListeners; //khai báo sl envent
// connect to Mongo
ConnectDB();

// config session
session.config(app);

// config view engine
configViewEngine(app);

// Enable post data for request
// app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

// Enable flash
app.use(connectFlash());

// user coolie parser
app.use(cookieParser());

//config passport js
app.use(passport.initialize());
app.use(passport.session());

// init all routes
initRoutes(app);


// init all socket
initSocket(io);

// config for socketid
configSocketio(io, cookieParser, session.sessionStore);

server.listen(database.port, database.hostname, () => {
  console.log(`Run ${database.hostname}:${database.port}`);
});

// import pem from 'pem';
// import https from 'https';
// pem.createCertificate({ days: 1, selfSigned: true }, function (err, keys) {
//   if (err) {
//     throw err
//   }

//     // init app
//   let app = express();

//   // connect to Mongo
//   ConnectDB();

//   // config session
//   connectSession(app);

//   // config view engine
//   configViewEngine(app);

//   // Enable post data for request
//   app.use(bodyParser.urlencoded({extended: true}));

//   // Enable flash
//   app.use(connectFlash());

//   //config passport js
//   app.use(passport.initialize());
//   app.use(passport.session());

//   // init all routes
//   initRoutes(app);
//   https.createServer({ key: keys.serviceKey, cert: keys.certificate }, app).listen(process.env.APP_PORT, process.env.APP_HOST, () => {
//     console.log(`running on ${process.env.APP_PORT}: ${process.env.APP_HOST}`);
//   })
// });


