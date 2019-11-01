import express from "express";
import { home, auth, user, contact, notifi } from "./../controllers/index"
import { authvalid, uservalid, contactvalid } from "./../validator/index";
import passport from "passport";
import initpassportlocal from "./../controllers/passportController/local"
import initpassportfb from "./../controllers/passportController/facebook"
import initpassportgg from "./../controllers/passportController/google"
initpassportlocal();
initpassportfb();
initpassportgg();
let router = express.Router();
/**
 * 
 * @param app 
 */
let initRouter = (app) => {
    router.get("/login", auth.checklogout, auth.getlogin); //2
    router.post("/register", auth.checklogout, authvalid.register, auth.postRegister);
    router.get("/verify/:token", auth.checklogout, auth.verifyacc_ctl);
    router.post('/login', auth.checklogout, passport.authenticate("local", {
        successRedirect: "/", // khi xác thực thành công chuyển hướng đến đâu ? => "/"
        failureRedirect: "/login", // nếu có lỗi chuyển về đâu? => "/login"
        successFlash: true, // true để cho phép gửi thông báo
        failureFlash: true,
    }));
    // login phải trùng với giá trị ở FE action="..";
    // authenticate() tham số 1 xác thực theo kiểu nào: => local
    router.get("/auth/facebook", auth.checklogout, passport.authenticate("facebook", { scope: ["email"] }));
    router.get("/auth/facebook/callback", auth.checklogout, passport.authenticate("facebook", {
        successRedirect: "/", // khi xác thực thành công chuyển hướng đến đâu ? => "/"
        failureRedirect: "/login", // nếu có lỗi chuyển về đâu? => "/login"
    }));
    router.get("/auth/google", auth.checklogout, passport.authenticate("google", { scope: ["email"] }));
    router.get("/auth/google/callback", auth.checklogout, passport.authenticate("google", {
        successRedirect: "/", // khi xác thực thành công chuyển hướng đến đâu ? => "/"
        failureRedirect: "/login", // nếu có lỗi chuyển về đâu? => "/login"
    }));
    router.get("/", auth.checklogin, home.gethome); //1
    router.get("/logout", auth.checklogin, auth.getlogout); //kiểm tra xem đăng nhập hay chưa , nếu đăng nhập rồi thì chuyển hướng đến controller để đăng xuất

    router.put("/user/update-avatar", auth.checklogin, user.updateavatar); //kiểm tra xem đăng nhập hay chưa , nếu đăng nhập rồi thì chuyển hướng đến controller để up avatar
    router.put("/user/update-userinfo", auth.checklogin, uservalid.UpdateInfo, user.updateinfo); //kiểm tra xem đăng nhập hay chưa , kiểm tra tính hợp lệ của info,nếu đăng nhập rồi thì chuyển hướng đến controller để update info
    router.put("/user/update-password", auth.checklogin, uservalid.UpdatePassword, user.UpdatePassword); //kiểm tra xem đăng nhập hay chưa , kiểm tra tính hợp lệ của info,nếu đăng nhập rồi thì chuyển hướng đến controller để update password

    router.get("/contact/find-users/:keyword", auth.checklogin, contactvalid.findUserContact, contact.FindUsersContact); //kiểm tra xem đăng nhập hay chưa , kiểm tra tính hợp lệ của info,nếu đăng nhập rồi thì chuyển hướng đến controller để tìm kiếm users
    router.post("/contact/add-new", auth.checklogin, contact.addNew); //kiểm tra xem đăng nhập hay chưa , kiểm tra tính hợp lệ của info,nếu đăng nhập rồi thì chuyển hướng đến controller để tìm kiếm users
    router.delete("/contact/remove-req-contact", auth.checklogin, contact.removeReqContact);
    router.get("/notification/read-more", auth.checklogin, notifi.readMore);
    router.put("/notification/mark-all-as-read", auth.checklogin, notifi.markAllRead);


    return app.use("/", router);
};
module.exports = initRouter;

/* 3
    khi truy cập register , sẽ validator dữ liệu rồi mới đến controller để sử lý
*/