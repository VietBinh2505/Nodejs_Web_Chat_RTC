$(document).ready(function() {
    $("#link-read-more-notify").bind("click", function() {
        let skipNumber = $("ul.list-notifyCations").find("div").length; // thấy ra số lượng các thẻ div (thẻ div chứ thông báo)
        // khi ấn xem thêm
        $("#link-read-more-notify").css("display", "none"); // ẩn xem thêm 10 thông áo
        $(".read-more-notify-loader").css("display", "inline-block"); // hiện icon loader
        $.get(`/notification/read-more?skipNumber=${skipNumber}`, (notifications) => {
            if (!notifications.length) {
                alertify.notify("Không còn thông báo!", "error", 5); // thông báo cho người dùng
                $("#link-read-more-notify").css("display", "inline-block"); // ẩn xem thêm 10 thông áo
                $(".read-more-notify-loader").css("display", "none"); // hiện icon loader
                return false;
            }
            notifications.forEach((notification) => {
                $("ul.list-notifyCations").append(`<li>${notification}</li>`);
            });
            $("#link-read-more-notify").css("display", "inline-block"); // ẩn xem thêm 10 thông áo
            $(".read-more-notify-loader").css("display", "none"); // hiện icon loader
        });
    });
});