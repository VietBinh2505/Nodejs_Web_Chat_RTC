import multer from "multer";
import { app } from "./../config/app";
import { avatarERR, tranSuccess, tranERR } from './../../lang/vi';
import { user } from "./../services/index";
import { validationResult } from "express-validator/check";
import fsextra from "fs-extra";
const SaltRounds = 7;
let storageavatar = multer.diskStorage({ //khai báo nơi chứa ảnh khi upload ảnh lên ứng dụng
    destination: (req, file, callback) => { // file là file mà user gửi lên, 
        callback(null, app.avatar_dicectory); //tham số lỗi (1) là null, tham số 2 là đường dẫn gửi file lưu trữ hình ảnh
    },
    filename: (req, file, callback) => { // file là file mà user gửi lên, 
        let math = app.avatar_type;
        if (math.indexOf(file.mimetype) === -1) { // so sánh type file có trùng với định dạng nào trong mảng math hay ko
            return callback(avatarERR.avatar_type, null); // có lỗi truyền ra thông báo và đường dẫn lưu ảnh là null
        }
        let avatarname = `${Date.now()}${file.originalname}`; //tạo ra 1 file name bất kì tránh trùng nhau của ảnh vừa tải lên
        callback(null, avatarname);
    },
});
let avataruploadfile = multer({
    storage: storageavatar, // khai báo folder chứa ảnh khi up
    limits: { fileSize: app.avatar_limit }, // giới hạn dung lượng của ảnh(1mb)

}).single("avatar"); // avatar phải trung với form truyền lên ở phần updateuer(dòng 37)
let updateavatar = (req, res) => {
    avataruploadfile(req, res, async(error) => { // thực hiện func nếu có lỗi thì cho nó vào error
        if (error) {
            if (error.message) {
                return res.status(500).send(avatarERR.avatar_data); // nếu có lỗi quas 1mb thì in ra và dừng lại
            }
            return res.status(500).send(error); // nếu có lỗi thì in ra và dừng lại
        }
        //nếu ko có lỗi trong quá trình kiểm tra thi:
        try {
            let updateuseritem = {
                avatar: req.file.filename,
                updateAT: Date.now(),
            };
            //update user
            let userupdate = await user.updateUser_svice(req.user._id, updateuseritem); // truyền kết quả id, updateuseritem cho updateUser trong file model,
            //sau khi update user xóa info user cũ đi(đợi 39 thực hiện xong)
            await fsextra.remove(`${app.avatar_dicectory}/${userupdate.avatar}`); // đường dẫn để xóa đi avatar cũ
            //(thắc mắc userupdate.avatar) do cơ chế hoạt động của mongoose xem lại dòng 60 user models
            // update xong rồi thông báo cho người dùng
            let result = {
                message: tranSuccess.info_success, // tạo thông báo cho 76 updateuser.js xử dụng
                imagesrc: `images/users/${req.file.filename}`, // tạo đường dẫn cho 78 updateuser.js xử dụng
            };
            return res.status(200).send(result);
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    });
};
let updateinfo = async(req, res) => {
    let errarr = [];
    let validationError = validationResult(req);
    if (!validationError.isEmpty()) { // nếu có lỗi thì ..
        let errors = Object.values(validationError.mapped()); //chuyển lỗi từ đối tượng qua mảng
        errors.forEach((item) => {
            errarr.push(item.msg); // thêm các lỗi vào mảng để truyền ra view
        });
        return res.status(500).send(errarr);
    }
    try {
        let UpDateInfoNew = req.body;
        await user.updateUser_svice(req.user._id, UpDateInfoNew); // truyền kết quả id, updateuseritem cho updateUser trong file userservice,
        let result = {
            message: tranSuccess.info_success, // tạo thông báo cho 76 updateuser.js xử dụng
        };
        return res.status(200).send(result);
    } catch (error) { // nếu có lỗi thì thông báo cho người dùng
        console.log(error);
        return res.status(500).send(errarr);
    }
};
let UpdatePassword = async(req, res) => {
    let errarr = [];
    let validationError = validationResult(req);
    if (!validationError.isEmpty()) { // nếu có lỗi thì ..
        let errors = Object.values(validationError.mapped()); //chuyển lỗi từ đối tượng qua mảng
        errors.forEach((item) => {
            errarr.push(item.msg); // thêm các lỗi vào mảng để truyền ra view
        });
        return res.status(500).send(errarr);
    }
    try {
        let DataUserPass = req.body; // req.body dữ liệu là 3 dòng password
        //new Promise(async(resolve, reject) => {
        //let CrrUser = 
        await user.updatePass_svice(req.user._id, DataUserPass); // tìm xem có tồn tại user này k??
        //     resolve(true);
        // });

        let result = {
            message: tranSuccess.UpdatePass_succes, // tạo thông báo cho 149, 169, 189  updateuser.js xử dụng
        };
        return res.status(200).send(result);
    } catch (error) { // nếu có lỗi thì thông báo cho người dùng
        console.log(error);
        return res.status(500).send(error);
    }
};
let ContactController = (req, res) => {

};
let removeRequestContact = (req, res) => {};
let addnew = (req, res) => {};
module.exports = {
    updateavatar: updateavatar,
    updateinfo: updateinfo,
    UpdatePassword: UpdatePassword,
    ContactController: ContactController,
    addnew: addnew,
    removeRequestContact: removeRequestContact,
};