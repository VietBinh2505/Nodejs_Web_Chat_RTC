$(document).ready(function() {
    $("#link-read-more-contacts-received").click(() => {
        let skipNumber = $("#request-contact-received").find("li").length; // thấy ra số lượng các thẻ div (thẻ div chứ thông báo)khi ấn xem thêm
        $("#link-read-more-contacts-received").css("display", "none"); // ẩn xem thêm 10 thông áo
        $(".read-more-contacts-received-loader").css("display", "inline-block"); // hiện icon loader
        $.get(`/contact/read-more-contacts-receided?skipNumber=${skipNumber}`, (newcontactUsers) => {
            if (!newcontactUsers.length) {
                alertify.notify("Không còn lời mời!", "error", 5); // thông báo cho người dùng
                $("#link-read-more-contacts-received").css("display", "inline-block"); // ẩn xem thêm 10 thông áo
                $(".read-more-contacts-received-loader").css("display", "none"); // hiện icon loader
                return false;
            }
            newcontactUsers.forEach((user) => {
                console.log(user);
                $("#request-contact-received")
                .find("ul")
                .append(`<li class="_contactList" data-uid="${user._id}">
                <div class="contactPanel">
                    <div class="user-avatar">
                        <img src="images/users/${user.avatar}" alt="">
                    </div>
                    <div class="user-name">
                        <p>${ (user.username !== null) ? user.username : "" }</p>
                    </div>
                    <br>
                    <div class="user-address">
                        <span>&nbsp ${(user.address !== null)? user.address : ""}</span>
                    </div>
                    <div class="user-acccept-contact-received" data-uid="${user._id}">
                        Chấp nhận
                    </div>
                    <div class="user-reject-request-contact-received action-danger" data-uid="${user._id}">
                        Xóa yêu cầu
                    </div>
                </div>
            </li>`);
            });
            $("#link-read-more-contacts-received").css("display", "inline-block"); // ẩn xem thêm 10 thông áo
            $(".read-more-contacts-received-loader").css("display", "none"); // hiện icon loader
        });
    });
});