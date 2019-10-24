import express from "express";
import { home, auth } from "./../controllers/index"
import { authvalid } from "./../validator/index";
let routes = express.Router();
/**
 * 
 * @param app 
 */
let initRoutes = (app) => {
    routes.get("/", home.gethome); //1
    routes.get("/login", auth.getlogin); //2
    routes.post("/register", authvalid.register, auth.postRegister); //3
    return app.use("/", routes);
};
module.exports = initRoutes;

/* 3
    khi truy cập register , sẽ validator dữ liệu rồi mới đến controller để sử lý
*/