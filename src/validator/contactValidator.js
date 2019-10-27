import { check } from "express-validator/check";
import { tranValidator } from './../../lang/vi';
let findUserContact = [
    check("keyword", tranValidator.err_keyword)
    .isLength({ min: 1, max: 20 })
    .matches(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/),
];

module.exports = {
    findUserContact: findUserContact,
}

// tất cả thông báo lỗi lúc này vẫn ở dưới server

/* 1:
    tham số 1: email phải trung với name="..." phần  input phía FE
    tham số 2: truyền thông báo lỗi (string) về cho client 
    isEmail : kiểm tra xem có phải email hay không.
    trim: loại bỏ khoảng trống
*/