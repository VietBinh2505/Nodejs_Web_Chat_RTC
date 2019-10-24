import { validationResult } from "express-validator/check";
import { auth } from '../services/index';
let getlogin = (req, res) => {
    return res.render("auth/master", {
        errors: req.flash("errors"), //định nghĩa errors là gì rồi truyền ra views
        success: req.flash("success"), //định nghĩa success là gì rồi truyền ra views
    });
};
// let checklogin = (req, res, next) => { //Nếu đăng nhập rồi mới được truy cập trang chủ
//     if (!req.isAuthenticated()) { //isAuthenticated trả về true or false
//         return res.redirect("/login"); // nếu chưa có tk thì đưa về trang login
//     }
//     next(); // nếu có tk rồi thì tiếp tục
// };
// let checklogout = (req, res, next) => { // Nếu đăng nhập rồi mới được đăng xuất
//     if (req.isAuthenticated()) {
//         return res.redirect("/"); // nếu có tk thì đưa về trang chủ
//     }
//     next(); // chưa có thì tiếp tục
// };
// let getlogout = (req, res) => {
//     req.logout(); // xóa passport user(người dùng) ở trong session
//     req.flash("success", tranSuccess.logout_success);
//     return res.redirect("/login");
// }
let postRegister = async(req, res) => {
    let errarr = [];
    let successArr = [];
    let validationError = validationResult(req);
    if (!validationError.isEmpty()) { // nếu có lỗi thì ..
        let errors = Object.values(validationError.mapped()); //chuyển lỗi từ đối tượng qua mảng
        errors.forEach((item) => {
            errarr.push(item.msg); // thêm các lỗi vào mảng để truyền ra view
        });
        req.flash("errors", errarr); // thông báo cho người dùng
        return res.redirect("/login"); //  chuyển hướng đến trang login
    }
    try {
        let createUserSuccess = await auth.register(req.body.email, req.body.gender, req.body.password, req.protocol, req.get("host")); // đợi service tạo ra 1 bảng truy vấn trong csdl
        successArr.push(createUserSuccess); // thêm thông báo vào mảng
        req.flash("success", successArr); // xuất thông báo ra cho người dùng
        return res.redirect("/login"); // chuyển hướng vế login
    } catch (error) { // nếu có lỗi 
        errarr.push(error); // thêm lỗi vào mảng
        req.flash("errors", errarr); // xuất lỗi trong mảng ra cho người dùng
        return res.redirect("/login"); // chuyển hướng đến trang login
    }
};
let verifyacc_ctl = async(req, res) => { //verify acc trước sau khi tạo tài khoản
    let errarr = []; // tạo 1 mảng chưa thong báo lỗi
    let successArr = []; // tạo 1 mảng chưa thong báo thành công
    try {
        let verifysuccess = await auth.verifyacc_sevice(req.params.token); // lấy ra thông báo khi tuy vấn kiểm tra và thay đổi trạng thái verify
        successArr.push(verifysuccess); // thêm thông báo thành công vào mảng
        req.flash("success", successArr); // in ra thông báo thahf công trong mảng
        return res.redirect("/login"); // chuyển hướng đến trang đăng nhập
    } catch (error) { // nếu có lỗi
        errarr.push(error); // thêm lỗi vào mảng lỗi
        req.flash("errors", errarr); // in thông báo lỗi cho người dùng
        return res.redirect("/login"); // chuyển hướng đến trang đăng nhập
    }
};

module.exports = {
    getlogin: getlogin,
    postRegister: postRegister,
    verifyacc_ctl: verifyacc_ctl,
    // getlogout: getlogout,
    // checklogin: checklogin,
    // checklogout: checklogout,
}