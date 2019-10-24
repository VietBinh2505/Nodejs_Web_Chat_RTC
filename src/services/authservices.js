import UserModels from '../models/UserModels';
import { tranERR, tranSuccess, transmail } from './../../lang/vi';
import bcrypt from "bcrypt";
import uuidv4 from "uuid/v4";
import sendmail from "./../config/mailler";
let saltRounds = 7;
let register = async(email, gender, password, protocol, host) => {
    return new Promise(async(resolve, reject) => {
        let userbyemail = await UserModels.findbyEmail(email); // tìm kiếm đã có email trong database chưa.
        if (userbyemail) {
            if (userbyemail.deletedAT != null) { // đã xóa tk.
                return reject(tranERR.err_acc_removed);
            }
            if (userbyemail.local.isactive) { // chưa active
                return reject(tranERR.err_acc_notactive);
            }
            return reject(tranERR.err_email_dk); // kiểm tra xem đã tồn tại chưa
        }
        let salt = bcrypt.genSaltSync(saltRounds);
        let useritem = {
            username: email.split("@")[0], //tách email thành 2 phần trước và sau "@", phần tử đầu là số 0
            gender: gender,
            local: {
                email: email,
                password: bcrypt.hashSync(password, salt),
                isactive: { type: Boolean, default: false },
                verifytoken: uuidv4(),
            },
        };
        let user = await UserModels.createNew(useritem); // đợi  database tạo ra 1 user name có thông tin của dòng 20
        let linkverify = `${protocol}://${host}/verify/${user.local.verifytoken}`; // link verify
        sendmail(email, transmail.subject, transmail.template(linkverify)) //gửi mail
            .then(success => { // nếu không có lỗi
                resolve(tranSuccess.userCreated(user.local.email));
            })
            .catch(async(error) => { // nếu có lỗi
                await UserModels.removeById(user._id) // xóa user đó đi theo id truyền vào
                reject(transmail.sendmailfail); // thông báo cho người dùng
            });
    });
};
let verifyacc_sevice = (token) => {
    return new Promise(async(resolve, reject) => { // trả về 1 promise
        let userByToken = await UserModels.findByToken(token); // tìm kiếm trong csdl đã có token này chưa
        if (!userByToken) { // nếu chưa có nghĩa là tk đã active rồi
            return reject(tranERR.err_tokenundefined); //  in ra thông báo lỗi 
        }
        await UserModels.verify(token); // truy vấn vào csdl tìm kiếm và thay đổi lại verify = true
        resolve(tranSuccess.acc_active); // truyền ra thông báo cho người dùng
    });
};
module.exports = {
    register: register,
    verifyacc_sevice: verifyacc_sevice,
};