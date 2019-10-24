import { check } from "express-validator/check";
import { tranValidator, tranERR } from './../../lang/vi';

let UpdateInfo = [
    check("username", tranValidator.update_username).optional().isLength({ min: 3, max: 15 })
    .matches(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/), //1
    check("gender", tranValidator.update_gender).optional().isIn(["male", "female"]),
    check("address", tranValidator.update_address).optional().isLength({ min: 3, max: 40 }),
    check("phone", tranValidator.update_phone).optional().matches(/^(0)[0-9]{9,10}$/),
];
let UpdatePassword = [
    check("mkhientai", tranERR.err_crr_pass_fail).isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/),
    check("mkmoi", tranERR.err_new_pass_fail).isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/),
    check("mknhaplai", tranERR.err_confim_pass_fail).custom((value, { req }) => value === req.body.mkmoi),
];

module.exports = {
    UpdateInfo: UpdateInfo,
    UpdatePassword: UpdatePassword,
};

// tất cả thông báo lỗi lúc này vẫn ở dưới server

/* 1:
    tham số 1: email phải trung với name="..." phần  input phía FE
    tham số 2: truyền thông báo lỗi (string) về cho client 
    optional() cho phép được rỗng
    isLength() giới hạn độ dài
*/
// ---------------------------
/* 2
    tham số 1: gender phải trung với name="..." phần  input phía FE
    tham số 2: truyền thông báo lỗi (string) về cho client 
    isIn : kt xem có khớp với value="" phần  input phía FE hay không, nếu sai sẽ báo lỗi.
*/
// ---------------------------

/* 3
    tham số 1: password phải trung với name="..." phần  input phía FE
    tham số 2: truyền thông báo lỗi (string) về cho client 
    islength: kiểm tra độ dài của dãy với điều kiện trong {..}
    matches: chuyền vào biểu thức chính quy để validate,
*/
// ---------------------------

/* 4
    tham số 1: password_confirmation phải trung với name="..." phần  input phía FE
    tham số 2: truyền thông báo lỗi (string) về cho client 
    islength: kiểm tra độ dài của dãy với điều kiện trong {..}
    custom: kiểm tra password_confirmation phải có value trùng với password phía trên.
*/