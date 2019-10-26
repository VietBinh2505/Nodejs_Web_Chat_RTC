let useravatar = null;
let userinfo = {};
let originavatarsrc = null;
let originuserinfo = {};
let userupdatepassword = {};

function CallLogout() {
    let timerInterval;
    Swal.fire({
        position: "top-end",
        title: "Tự động đăng xuất sau 5s",
        html: "Thời gian: <strong></strong>",
        timer: 5000,
        onBeforeOpen: () => {
            Swal.showLoading();
            timerInterval = setInterval(() => {
                Swal.getContent().querySelector("strong").textContent = Math.ceil(Swal.getTimerLeft() / 1000);
            }, 1000);
        },
        onClose: () => {
            clearInterval(timerInterval);
        }
    }).then((result) => {
        $.get("/logout", () => {
            location.reload();
        })
    });
};
let updateUserinfo = () => { // kiểm tra tính hợp lệ của ảnh tải lên
    $("#input-change-avatar").change(() => { //input-change-avatar trùng với id="" phía FE
        let filedata = $("#input-change-avatar").prop("files")[0]; // lấy file người dùng cập nhật ảnh nhưng chư
        let math = ["image/png", "image/jpg", "image/jpeg"]; // chỉ cho up ảnh có định dạng như trong mảng
        let limit = 1048576; // giới hạn dung lượng tải lên là 1mb
        // trường hợp ảnh tải lên không hợp lệ:
        if ($.inArray(filedata.type, math) == -1) { // so sánh type filedata có trùng với định dạng nào trong mảng math hay ko
            alertify.notify("Định dang file không hợp lệ!", "error", 5); //thông báo lỗi cho client trong 5s
            $("#input-change-avatar").val(null); // làm mới khung nhập ảnh
            return false; // bị lỗi sẽ dừng ngay
        }
        if (filedata > limit) { // so sánh dung lượng ảnh tải lên
            alertify.notify("Dung lượng ảnh không hợp lệ!", "error", 5); //thông báo lỗi cho client trong 5s
            $("#input-change-avatar").val(null); // làm mới khung nhập ảnh
            return false; // bị lỗi sẽ dừng ngay
        }
        // trường hợp ảnh tải lên hợp lệ:
        if (typeof(FileReader) != "undefined") {
            let imagePreview = $("#image-edit-profile");
            imagePreview.empty(); // làm rỗng để chuẩn bị lấy chỗ chứa ảnh mới,

            let fileReader = new FileReader();
            fileReader.onload = ((element) => {
                $("<img>", {
                    "src": element.target.result, // lấy thuộc tính ảnh mới up lên
                    "class": "avatar img-circle", // lấy class trùng với phía FE
                    "alt": "avatar",
                    "id": "user-modal-avatar", //lấy id trùng với phía FE
                }).appendTo(imagePreview); // sau khi vùng nhớ ảnh cũ đã rỗng sẽ thêm ảnh mới có các thuộc tính vào vùng nhớ này, bằng appendTo()
            });
            imagePreview.show(); // hiển thị ra ảnh vừa thêm mới
            fileReader.readAsDataURL(filedata);
            let formdata = new FormData();
            formdata.append("avatar", filedata);
            useravatar = formdata;
        } else {
            alertify("Trình duyệt chưa hỗ trợ!", "error", 7); // nếu trình duyệt chưa hỗ trợ filereader thông báo cho client trong 5s
        }
    });
    $("#input-change-username").change(() => { //input-change-username trùng với id="" trùng với  file ejs
        let Username = $("#input-change-username").val();
        let RegUserName = new RegExp(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/);
        if (!RegUserName.test(Username)) { //kiểm tra username mới nhập có khác chuỗi reg hay ko, nếu có thì...
            alertify.notify("Username Không Hợp Lệ!", "error", 5);
            $("#input-change-username").val(originuserinfo.username);
            delete userinfo.username; // khi người dùng nhập đúng dữ liệu lần đàu tiên đã tồn  tại userinfo.username nhưng sau đó họ lại nhập dữ liệu khác sai thì xóa cái cũ username đi
            return false;
        }
        userinfo.username = Username;
    });
    $("#input-change-gender-male").bind("click", () => { //input-change-gender-male trùng với id="" trùng với  file ejs
        let gender = $("#input-change-gender-male").val();
        if (gender !== "male") {
            alertify.notify("Giới tính không hợp lệ!", "error", 5);
            $("#input-change-gender-male").val(originuserinfo.gender);
            delete userinfo.gender; // khi người dùng nhập đúng dữ liệu lần đàu tiên đã tồn  tại userinfo.username nhưng sau đó họ lại nhập dữ liệu khác sai thì xóa cái cũ username đi
            return false;
        }
        userinfo.gender = gender;
    });
    $("#input-change-gender-female").bind("click", () => { //input-change-gender-female trùng với id="" file ejs
        let gender = $("#input-change-gender-female").val();
        if (gender !== "female") {
            alertify.notify("Giới tính không hợp lệ!", "error", 5);
            $("#input-change-gender-female").val(originuserinfo.gender);
            delete userinfo.gender; // khi người dùng nhập đúng dữ liệu lần đàu tiên đã tồn  tại userinfo.username nhưng sau đó họ lại nhập dữ liệu khác sai thì xóa cái cũ username đi
            return false;
        }
        userinfo.gender = gender;
    });
    $("#input-change-address").change(() => { //input-change-address trùng với id="" file ejs
        let Address = $("#input-change-address").val();
        if (Address.length < 3 || Address.length > 40) {
            alertify.notify("Địa chỉ không hợp lệ!", "error", 5);
            $("#input-change-address").val(originuserinfo.address);
            delete userinfo.address; // khi người dùng nhập đúng dữ liệu lần đàu tiên đã tồn  tại userinfo.username nhưng sau đó họ lại nhập dữ liệu khác sai thì xóa cái cũ username đi
            return false;
        }
        userinfo.address = Address;
    });
    $("#input-change-phone").change(() => { //input-change-phone trùng với id="" phía FE
        let Phone = $("#input-change-phone").val();
        let RegPhone = new RegExp(/^(0)[0-9]{9,10}$/); // điều kiện hợp lệ của sđt
        if (!RegPhone.test(Phone)) { // kiểm tra sđt người dùng nhập vào có trùng với đk hay không
            alertify.notify("SĐT Không Hợp Lệ!", "error", 5);
            $("#input-change-phone").val(originuserinfo.phone);
            delete userinfo.phone; // khi người dùng nhập đúng dữ liệu lần đàu tiên đã tồn  tại userinfo.username nhưng sau đó họ lại nhập dữ liệu khác sai thì xóa cái cũ username đi
            return false;
        }
        userinfo.phone = Phone; // nếu ko có lỗi thì thêm sđt vào đối tượng userinfo
    });
    $("#input-change-current-password").change(() => {
        let mkhientai = $("#input-change-current-password").val(); // lấy chuỗi mk người dùng nhập vào
        let Regmkhientai = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/);
        if (!Regmkhientai.test(mkhientai)) {
            alertify.notify("Password Không Hợp Lệ!", "error", 5);
            $("#input-change-current-password").val(null); // nếu có lõi thì cho nó về trống
            delete userupdatepassword.mkhientai; // khi người dùng nhập đúng dữ liệu lần đàu tiên đã tồn  tại userinfo.username nhưng sau đó họ lại nhập dữ liệu khác sai thì xóa cái cũ username đi
            return false;
        }
        userupdatepassword.mkhientai = mkhientai; // nếu chuỗi người dùng nhập vào hợp lệ thì cho vào đối tượng userupdatepassword

    });
    $("#input-change-new-password").change(() => {
        let mkmoi = $("#input-change-new-password").val();
        let Regmkmoi = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/);
        if (!Regmkmoi.test(mkmoi)) {
            alertify.notify("Password Không Hợp Lệ!", "error", 5);
            $("#input-change-new-password").val(null); // nếu có lõi thì cho nó về trống
            delete userupdatepassword.mkmoi; // khi người dùng nhập đúng dữ liệu lần đàu tiên đã tồn  tại userinfo.username nhưng sau đó họ lại nhập dữ liệu khác sai thì xóa cái cũ username đi
            return false;
        }
        userupdatepassword.mkmoi = mkmoi; // nếu chuỗi người dùng nhập vào hợp lệ thì cho vào đối tượng userupdatepassword

    });
    $("#input-change-confirm-password").change(() => {
        let mknhaplai = $("#input-change-confirm-password").val(); // lấy chuỗi mk người dùng nhập vào
        if (!userupdatepassword.mkmoi) {
            alertify.notify("Bạn chưa nhập password mới!", "error", 5);
            $("#input-change-confirm-password").val(null);
            delete userupdatepassword.mknhaplai; // khi người dùng nhập đúng dữ liệu lần đàu tiên đã tồn  tại userinfo.username nhưng sau đó họ lại nhập dữ liệu khác sai thì xóa cái cũ username đi
            return false;
        }
        if (mknhaplai !== userupdatepassword.mkmoi) {
            alertify.notify("Password confirm Không Hợp Lệ!", "error", 5);
            $("#input-change-confirm-password").val(null);
            delete userupdatepassword.mknhaplai; // khi người dùng nhập đúng dữ liệu lần đàu tiên đã tồn  tại userinfo.username nhưng sau đó họ lại nhập dữ liệu khác sai thì xóa cái cũ username đi
            return false;
        }
        userupdatepassword.mknhaplai = mknhaplai;
    });
};

function CallUpdateUserAvatar() {
    $.ajax({
        url: "/user/update-avatar",
        type: "put", // method khi up 1 trường dữ liệu nào đó
        cache: false,
        contentType: false,
        processData: false, // cache, contentType, processData khi muốn gửi req có dl là formdata 
        data: useravatar, //truyền lên data là useravatar
        success: (result => {
            $(".user-modal-alert-success").find("span").text(result.message); // ghi đè lên vùng hiển thị thông báo lỗi
            $(".user-modal-alert-success").css("display", "block"); // ghi đè lên thuộc tính cho phép css hiện thông báo
            $("#navbar-avatar").attr("src", result.imagesrc); // cập nhật ảnh đại diện luôn cho avatar con
            originavatarsrc = result.imagesrc;
            $("#input-btn-cancel-update-user").click();
        }),
        error: function(error) { // nếu có lỗi thì hiển thị lỗi
            $(".user-modal-alert-error").find("span").text(error.responseText); // ghi đè lên vùng hiển thị thông báo lỗi
            $(".user-modal-alert-error").css("display", "block"); // ghi đè lên thuộc tính cho phép css hiện thông báo
            $("#input-btn-cancel-update-user").click();
        },
    });
};

function CallUpdateUserInfo() {
    $.ajax({
        url: "/user/update-userinfo",
        type: "put", // method khi up 1 trường dữ liệu nào đó
        data: userinfo, //truyền lên data là userinfo
        success: (result => {
            $(".user-modal-alert-success").find("span").text(result.message); // ghi đè lên vùng hiển thị thông báo lỗi
            $(".user-modal-alert-success").css("display", "block"); // ghi đè lên thuộc tính cho phép css hiện thông báo
            originuserinfo = Object.assign(originuserinfo, userinfo); //sao chép tất cả thông tin của userinfo(những thông tin thay đổi) ghi đè lên originuserinfo(hiện lên dao diện)
            $("#navbar-username").text(originuserinfo.username);
            $("#input-btn-cancel-update-user").click(); // reset mọi thứ
        }),
        error: function(error) { // nếu có lỗi thì hiển thị lỗi
            $(".user-modal-alert-error").find("span").text(error.responseText); // ghi đè lên vùng hiển thị thông báo lỗi
            $(".user-modal-alert-error").css("display", "block"); // ghi đè lên thuộc tính cho phép css hiện thông báo
            $("#input-btn-cancel-update-user").click();
        },
    });
};

function CallUpdatePassword() {
    $.ajax({
        url: "/user/update-password",
        type: "put", // method khi up 1 trường dữ liệu nào đó
        data: userupdatepassword, //truyền lên data là userupdatepassword
        success: (result => {
            $(".user-modal-password-alert-success").find("span").text(result.message); // ghi đè lên vùng hiển thị thông báo lỗi
            $(".user-modal-password-alert-success").css("display", "block"); // ghi đè lên thuộc tính cho phép css hiện thông báo
            $("#input-btn-cancel-update-user-password").click(); // reset mọi thứ
            CallLogout();
        }),
        error: function(error) { // nếu có lỗi thì hiển thị lỗi
            $(".user-modal-password-alert-error").find("span").text(error.responseText); // ghi đè lên vùng hiển thị thông báo lỗi
            $(".user-modal-password-alert-error").css("display", "block"); // ghi đè lên thuộc tính cho phép css hiện thông báo
            $("#input-btn-cancel-update-user-password").click();
        },
    });
};

$(document).ready(() => {
    originavatarsrc = $("#user-modal-avatar").attr("src");
    originuserinfo = {
        username: $("#input-change-username").val(), // lấy username người dùng nhập mới
        gender: ($("#input-change-gender-male").is("checked")) ? $("#input-change-gender-male").val() : $("#input-change-gender-female").val(),
        address: $("#input-change-address").val(), // lấy address người dùng nhập mới
        phone: $("#input-change-phone").val(), // lấy phone người dùng nhập mới 
    };
    updateUserinfo(); // kiểm tra tính hợp lệ của ảnh tải lên
    $("#input-btn-update-user").click(() => { // kiểm tra khi click thì thực hiện func
        if ($.isEmptyObject(userinfo) && !useravatar) { // nếu chưa thay đổi gì mà ấn submit
            alertify.notify("Bạn đã thay đổi thông tin trước khi update!", "error", 5);
            return false;
        }
        if (useravatar) { // nếu có avatar
            CallUpdateUserAvatar(); // gọi hàm update avatar
        }
        if (!$.isEmptyObject(userinfo)) { // nếu có thông tin 
            CallUpdateUserInfo(); // gọi hàm update thông tin
        }
    });
    $("#input-btn-cancel-update-user").click(() => { // kiểm tra khi click thì thực hiện func
        useravatar = null;
        userinfo = {};
        $("#input-change-avatar").val(null);
        $("#user-modal-avatar").attr("src", originavatarsrc);

        $("#input-change-username").val(originuserinfo.username); // lấy username người dùng nhập mới
        (originuserinfo.gender === "male") ? $("#input-change-gender-male").click(): $("#input-change-gender-fe").click();
        $("#input-change-address").val(originuserinfo.address); // lấy address người dùng nhập mới
        $("#input-change-phone").val(originuserinfo.phone); // lấy phone người dùng nhập mới
    });
    $("#input-btn-update-user-password").click(() => {
        if (!userupdatepassword.mkhientai || !userupdatepassword.mkmoi || !userupdatepassword.mknhaplai) { // kiểm tra có mk hay ko
            alertify.notify("Bạn phải thay đổi đầy đủ thông tin trước khi update!", "error", 5);
            return false;
        }
        Swal.fire({
            title: "Bạn có chắc cập nhật không?",
            text: "Bạn sẽ không thể khôi phục lại nó!",
            type: "Cảnh Báo!",
            showCancelButton: true,
            confirmButtonColor: "#2ECC71",
            cancelButtonColor: "#ff7675",
            confirmButtonText: "Xác Nhận",
            cancelButtonText: "Hủy",
        }).then((result) => {
            if (!result.value) {
                $("#input-btn-cancel-update-user-password").click();
                return false;
            }
            CallUpdatePassword();
        });
    });
    $("#input-btn-cancel-update-user-password").click(() => {
        userupdatepassword = {};
        $("#input-change-current-password").val(null);
        $("#input-change-new-password").val(null);
        $("#input-change-confirm-password").val(null);
    });
});