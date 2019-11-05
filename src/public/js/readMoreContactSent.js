$(document).ready(function() {
    $("#link-read-more-contacts-sent").click(() => {
        let skipNumber = $("#request-contact-sent").find("li").length; // thấy ra số lượng các thẻ div (thẻ div chứ thông báo)
        // khi ấn xem thêm
        $("#link-read-more-contacts-sent").css("display", "none"); // ẩn xem thêm 10 thông áo
        $(".read-more-contacts-sent-loader").css("display", "inline-block"); // hiện icon loader
        $.get(`/contact/read-more-contacts-sent?skipNumber=${skipNumber}`, (newcontactUsers) => {
            if (!newcontactUsers.length) {
                alertify.notify("Không còn danh sách!", "error", 5); // thông báo cho người dùng
                $("#link-read-more-contacts-sent").css("display", "inline-block"); // ẩn xem thêm 10 thông áo
                $(".read-more-contacts-sent-loader").css("display", "none"); // hiện icon loader
                return false;
            }
            newcontactUsers.forEach((User) => {
                $("#request-contact-sent")
                .find("ul")
                .append(`<li class="_contactList" data-uid="${User._id}">
                <div class="contactPanel">
                    <div class="user-avatar">
                        <img src="images/users/${User.avatar}" alt="">
                    </div>
                    <div class="user-name">
                        <p>${ (User.username !== null) ? User.username : "" }</p>
                    </div>
                    <br>
                    <div class="user-address"> 
                        <span>${(User.address !== null)? User.address : ""}</span>
                    </div>
                    <div class="user-remove-request-sent action-danger" data-uid="${User._id}">
                        Hủy yêu cầu
                    </div>
                </div>
            </li>`);
            });
            $("#link-read-more-contacts-sent").css("display", "inline-block"); // ẩn xem thêm 10 thông áo
            $(".read-more-contacts-sent-loader").css("display", "none"); // hiện icon loader
        });
    });
});