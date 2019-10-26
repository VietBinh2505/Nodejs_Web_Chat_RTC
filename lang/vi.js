export const tranValidator = {
    err_email: "Email phải có dạng example@gmai.com!",
    err_gender: "Hãy điền giới tính của bạn!",
    err_password: "Password không hợp lệ!",
    err_password_confirmation: "Nhập lại mật khẩu không chính xác!",
    update_username: "Username không hợp lệ",
    update_gender: "Giới tính không hợp lệ!",
    update_address: "Địa chỉ không hợp lệ!",
    update_phone: "SĐT không hợp lệ",
};
export const tranERR = {
    err_email_dk: "Email đã được tồn tại!",
    err_acc_removed: "Tài khoản đã bị gỡ khỏi hệ thống!",
    err_tokenundefined: "token không tồn tại!",
    err_loginfail: "Email hoặc mật khẩu không đúng!",
    err_server: "Có lỗi phía server!",
    err_update_pass: "Không tồn tại tài khoản này!",
    err_crr_pass_fail: "Mật khẩu hiện tại chưa chính xác!",
    err_new_pass_fail: "Mật khẩu mới không hợp lệ!",
    err_confim_pass_fail: "Mật khẩu nhập lại không hợp lệ!",
    err_acc_notactive: "Tài khoảng chưa được active",
};
export const tranSuccess = {
    userCreated: (usermail) => {
        return `Tài khoản ${usermail} đã được tạo, vui lòng kiểm tra email để active`;
    },
    acc_active: "Kích hoạt tài khoản thành công!",
    login_succsess: (username) => {
        return `Xin chao ${username}, Bạn đã đăng nhập thành công!`;
    },
    logout_success: "Đăng xuất thành công!",
    info_success: "Thay đổi thông tin thành công!",
    UpdatePass_succes: "Thay đổi mật khẩu thành công!",
};
export const avatarERR = {
    avatar_type: "Định dạng của hình ảnh không hợp lê!",
    avatar_data: "Dung lượng ảnh quá lớn!",
};

export const transmail = {
    subject: "Xác nhận kích hoạt tài khoản!",
    template: (linkVerify) => {
        return `
        <h2>Bạn nhận được email vì đã đăng kí tài khoản trên ứng dụng Chat!</h2>
        <h2> Hãy Click để kích hoạt! </h2>
        <h2><a href="${linkVerify}" target="blank">${linkVerify}</a></h2>
        `;
    },
    sendmailfail: "Có lỗi trong quá trình gửi email!",
};