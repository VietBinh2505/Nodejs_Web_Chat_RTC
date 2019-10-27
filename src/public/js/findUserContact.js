function callFindUser(i) {
    if (i.which === 13 || i.type === "click") {
        let keyword = $("#input-find-users-contact").val(); // lấy hết giá trị lưu trữ trong biên keyword
        let Regkeyword = new RegExp(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/);

        if (!keyword.length) {
            alertify.notify("Bạn phải nhập thông tin tìm kiếm!", "error", 5);
            return false;
        }
        if (!Regkeyword.test(keyword)) {
            alertify.notify("Từ khóa tìm kiếm không hợp lệ, chỉ cho phép ký tự chữ cái, số và khoảng trắng!", "error", 5);
            return false;
        }
        $.get(`/contact/find-users/${keyword}`, function(data) {
            $("#find-user ul").html(data); // tìm tới id="find-user" và thẻ ul, thêm data vào đó
            addContact();
            removeReqContact();
        });

    }
}

$(document).ready(() => {
    $("#input-find-users-contact").bind("keypress", callFindUser)
    $("#btn-find-users-contact").bind("click", callFindUser);
});