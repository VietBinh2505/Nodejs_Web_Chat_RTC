import express from "express";
import connectDB from "./config/connectDB";
import Configviewengine from "./config/viewEngine";
import initRoutes from "./routes/web";
import bodyparser from "body-parser";
import connectFlash from "connect-flash";
import session from "./config/session";
import passport from "passport";
import database from "./config/database";
import http from "http";
import socketio from "socket.io";
import initSockets from "./sockets/index";
import cookieParser from "cookie-parser";
import configSocketio from "./config/socketio";
let app = express();
let server = http.createServer(app);
let io = socketio(server);
connectDB(); // Kết nối tới mongodb
session.config(app);
Configviewengine(app); // config view engine
app.use(bodyparser.urlencoded({ extended: true })); // sử dụng body parse
app.use(connectFlash()); // sử dụng body parse
app.use(passport.initialize()); // sử dụng passport
app.use(passport.session()); //passport sẽ gọi dữ liệu trong session 
app.use(cookieParser()); //sử dụng cookieparser

configSocketio(io, cookieParser, session.sessionStore); // khởi tạo cấu hình sử dụng socketio
initRoutes(app); // Khởi tạo route
initSockets(io); // Khởi tạo tất cả socket

server.listen(database.port, database.hostname, () => {});