import express from "express";
import connectDB from "./config/connectDB";
import Configviewengine from "./config/viewEngine";
import initRoutes from "./routes/web";
import bodyparser from "body-parser";
import connectFlash from "connect-flash";
import configsession from "./config/session";
import passport from "passport";
import database from "./config/database";
let app = express();
connectDB(); // Kết nối tới mongodb
configsession(app);
Configviewengine(app); // config view engine
app.use(bodyparser.urlencoded({ extended: true })); // sử dụng body parse
app.use(connectFlash()); // sử dụng body parse
app.use(passport.initialize()); // sử dụng passport
app.use(passport.session()); //passport sẽ gọi dữ liệu trong session 
initRoutes(app); // Khởi tạo route

app.listen(database.port, database.hostname, () => {});