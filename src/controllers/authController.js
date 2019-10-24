import { validationResult } from "express-validator/check";
import { auth } from '../services/index';
let getlogin = (req, res) => {
    return res.render("auth/master", {
        errors: req.flash("errors"), //định nghĩa errors là gì rồi truyền ra views
        success: req.flash("success"), //định nghĩa success là gì rồi truyền ra views
    });
};

let postRegister = async(req, res) => {
    let errarr = [];
    let successArr = [];
    let validationError = validationResult(req);
    if (!validationError.isEmpty()) { // nếu có lỗi thì ..
        let errors = Object.values(validationError.mapped()); //chuyển lỗi từ đối tượng qua mảng
        errors.forEach((item) => {
            errarr.push(item.msg); // thêm các lỗi vào mảng để truyền ra view
        });
        req.flash("errors", errarr);
        return res.redirect("/login");
    }
    try {
        //       let createUserSuccess = await auth.register(req.body.email, req.body.gender, req.body.password, req.protocol, req.get("host"));
        let createUserSuccess = await auth.register(req.body.email, req.body.gender, req.body.password);
        successArr.push(createUserSuccess);
        req.flash("success", successArr);
        return res.redirect("/login");
    } catch (error) {
        errarr.push(error);
        req.flash("errors", errarr);
        return res.redirect("/login");
    }
    // };
    // let verifyacc = async(req, res) => {
    //     let errarr = [];
    //     let successArr = [];
    //     try {
    //         let verifysuccess = await auth.verifyacc(req.params.token);
    //         successArr.push(verifysuccess);
    //         req.flash("success", successArr);
    //         return res.redirect("/login");
    //     } catch (error) {
    //         errarr.push(error);
    //         req.flash("errors", errarr);
    //         return res.redirect("/login");
    //     }
};
module.exports = {
    getlogin: getlogin,
    postRegister: postRegister,
    //verifyacc: verifyacc,
}