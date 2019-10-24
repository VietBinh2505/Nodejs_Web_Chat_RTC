import UserModels from '../models/UserModels';
import { tranERR, tranSuccess } from './../../lang/vi';
import bcrypt from "bcrypt";
import uuidv4 from "uuid/v4";
// import sendmail from "./../config/mailler";
let saltRounds = 7;
//let register = async(email, gender, password, protocol, host) => {
let register = (email, gender, password) => {
    return new Promise(async(resolve, reject) => {
        let userbyemail = await UserModels.findbyEmail(email);
        if (userbyemail) {
            if (userbyemail.deletedAT != null) { // đã xóa tk.
                return reject(tranERR.err_acc_removed);
            }
            if (!userbyemail.local.isactive) { // chưa active
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
                verifytoken: uuidv4()
            },
        };
        let user = await UserModels.createNew(useritem);
        resolve(tranSuccess.userCreated(user.local.email));
        //         let linkverify = `${protocol}://${host}/verify/${user.local.verifytoken}`;
        //         sendmail(email, transmail.subject, transmail.template(linkverify))
        //             .then(success => {
        //                 resolve(tranSuccess.UserCreated(uers.local.email));
        //             })
        //             .catch(async(error) => {
        //                 await UserModels.removeById(user._id)
        //                 reject(transmail.sendmailfail);
        //             });
        //     });
    });
};
let verifyacc = (token) => {
    //     return new Promise(async(resolve, reject) => {
    //         let userByToken = await UserModels.verifytoken(token);
    //         if (!userByToken) {
    //             return reject(tranERR.err_tokenundefined);
    //         }
    //         await UserModels.verify(token);
    //         resolve(tranSuccess.acc_active); // truyền ra thông báo cho người dùng
    //     });
};
module.exports = {
    register: register,
    verifyacc: verifyacc,
};