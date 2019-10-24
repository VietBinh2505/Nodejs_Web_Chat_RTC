import { check } from "express-validator/check";
import { tranValidator } from './../../lang/vi';
let register = [
    check("email", tranValidator.err_email).isEmail().trim(), //1
    check("gender", tranValidator.err_gender).isIn(["male", "female"]), //2

    check("password", tranValidator.err_password).isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/), //3

    check("password_confirmation", tranValidator.err_password_confirmation)
    .custom((value, { req }) => { return value === req.body.password; }), //4
];

module.exports = {
    register: register,
}

// tất cả thông báo lỗi lúc này vẫn ở dưới server

/* 1:
    tham số 1: email phải trung với name="..." phần  input phía FE
    tham số 2: truyền thông báo lỗi (string) về cho client 
    isEmail : kiểm tra xem có phải email hay không.
    trim: loại bỏ khoảng trống
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