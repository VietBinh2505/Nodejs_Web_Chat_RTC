import { contact } from "./../services/index";
import { validationResult } from "express-validator/check";

let readMoreContactsReceided = async(req, res) => {
    try { 
        let skipNumberNoti = +(req.query.skipNumber);
        // lấy thêm id
        let newcontactUsers = await contact.readMoreContactsReceided(req.user._id, skipNumberNoti); //truyền id hiện tại,
        return res.status(200).send(newcontactUsers);
    } catch (error) {
        console.log('loi tai ctl/readMoreContactsReceided');
        console.log(error);
        res.status(500).send(error);
    }
};
let readMoreContactsSent = async(req, res) => {
    try {
        let skipNumberNoti = +(req.query.skipNumber);
        // lấy thêm id
        let newcontactUsers = await contact.readMoreContactsSent(req.user._id, skipNumberNoti); //truyền id hiện tại,
        return res.status(200).send(newcontactUsers);
    } catch (error) {
        console.log('loi tai ctl/readMoreContactsSent');
        console.log(error);
        res.status(500).send(error);
    }
};

let readMoreContacts = async(req, res) => {
    try {
        let skipNumberNoti = +(req.query.skipNumber);
        // lấy thêm id
        let newcontactUsers = await contact.readMoreContacts(req.user._id, skipNumberNoti); //truyền id hiện tại,
        return res.status(200).send(newcontactUsers);
    } catch (error) {
        console.log('loi tai ctl/readMoreContacts');
        console.log(error);
        res.status(500).send(error);
    }
};
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
        console.log('loi tai ctl/FindUsersContact');
        console.log(error);
        return res.status(500).send(error);
    }
};
let addNew = async(req, res) => {
    try {
        let IdCRR = req.user._id; // lấy ra id, id này đã lưu vào session;
        let contactid = req.body.uid;
        let newcontact = await contact.addNew(IdCRR, contactid);
        return res.status(200).send({ success: !!newcontact });
    } catch (error) {
        console.log('loi tai ctl/addNew');
        console.log(error);
        return res.status(500).send(error);
    }
};
let removeReqContactSent = async(req, res) => {
    try {
        let IdCRR = req.user._id; // lấy ra id, id này đã lưu vào session;
        let contactid = req.body.uid;
        let removeReq = await contact.removeReqContactSent(IdCRR, contactid);
        return res.status(200).send({ success: !!removeReq });
    } catch (error) {
        console.log('loi tai ctl/removeReqContactSent');
        console.log(error);
        return res.status(500).send(error);
    }
};

module.exports = {
    FindUsersContact: FindUsersContact,
    addNew: addNew,
    removeReqContactSent: removeReqContactSent,
    readMoreContacts: readMoreContacts,
    readMoreContactsSent: readMoreContactsSent,
    readMoreContactsReceided: readMoreContactsReceided,
};