import usermd from "./../models/UserModels";
import { tranERR } from '../../lang/vi';
import bcrypt from "bcrypt";
const SaltRounds = 7;
let updateUser_svice = (id, UpDateInfoNew) => { // update userinfo
    return usermd.updateUser_md(id, UpDateInfoNew); // lấy dữ liệu từ userupdate / con troller
};
let updatePass_svice = (id, DataUserPass) => { // update userinfo
    return new Promise(async(resolve, reject) => {
        let CrrUser = await usermd.findUserbyId(id); // tìm xem có tồn tại user này k??
        if (!CrrUser) { // Không tồn tại user có id dòng 9
            return reject(tranERR.err_update_pass); // thông báo cho người dùng
        }
        let CheckCrrPass = await CrrUser.comparePassword(DataUserPass.mkhientai); // kiểm tra mk người dùng nhập có trùng vs mk trong csdl ko
        if (!CheckCrrPass) { // nếu ko trùng thi...
            return reject(tranERR.err_crr_pass_fail); // thông báo cho người dùng
        }
        // // nếu trùng thi mã hóa mk mới và cập nhập cho csdl
        let salt = bcrypt.genSaltSync(SaltRounds); // mã hóa mk mới
        await usermd.UpdatePassword(id, bcrypt.hashSync(DataUserPass.mkmoi, salt)); // truyền id và mk đã mã hóa qua cho usermadel xử lý
        resolve(true);
    });
};
module.exports = {
    updateUser_svice: updateUser_svice,
    updatePass_svice: updatePass_svice,
};