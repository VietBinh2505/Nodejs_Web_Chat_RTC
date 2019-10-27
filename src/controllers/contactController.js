import { contact } from "./../services/index";
import { validationResult } from "express-validator/check";
let FindUsersContact = async(req, res) => {
    let errarr = [];
    let validationError = validationResult(req);
    if (!validationError.isEmpty()) { // nếu có lỗi thì ..
        let errors = Object.values(validationError.mapped()); //chuyển lỗi từ đối tượng qua mảng
        errors.forEach((item) => {
            errarr.push(item.msg); // thêm các lỗi vào mảng để truyền ra view
        });
        console.log(errarr);
        return res.status(500).send(errarr);
    }
    try {
        let IdCRR = req.user._id; // lấy ra id, id này đã lưu vào session;
        let KeyWord = req.params.keyword; // lấy ra keyword từ thanh url
        let users = await contact.FindUsersContact(IdCRR, KeyWord);
        res.render("main/contact/sections/findUserContact", { users });
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
};

module.exports = {
    FindUsersContact: FindUsersContact,
};