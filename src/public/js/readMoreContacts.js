$(document).ready(function() {
    $("#link-read-more-contacts").bind("click",() => {
        let skipNumber = $("#contacts").find("li").length; // thấy ra số lượng các thẻ div (thẻ div chứ thông báo)
        // khi ấn xem thêm
        $("#link-read-more-contacts").css("display", "none"); // ẩn xem thêm 10 thông áo
        $(".read-more-contacts-loader").css("display", "inline-block"); // hiện icon loader
        $.get(`/contact/read-more-contacts?skipNumber=${skipNumber}`, (newcontactUsers) => {
            if (!newcontactUsers.length) {
                alertify.notify("Không còn bạn bè!", "error", 5); // thông báo cho người dùng
                $("#link-read-more-contacts").css("display", "inline-block"); // ẩn xem thêm 10 thông áo
                $(".read-more-contacts-loader").css("display", "none"); // hiện icon loader
                return false;
            }
            newcontactUsers.forEach((User) => {
                $("#contacts").find("ul").append(`<li><li class="_contactList" data-uid="${User._id}">
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
                        <div class="user-talk" data-uid="${User._id}">
                            Trò chuyện
                        </div>
                        <div class="user-remove-contact action-danger" data-uid="${User._id}">
                            Xóa liên hệ
                        </div>
                    </div>
                </li></li>`);
            });
            $("#link-read-more-contacts").css("display", "inline-block"); // ẩn xem thêm 10 thông áo
            $(".read-more-contacts-loader").css("display", "none"); // hiện icon loader
        });
    });
});