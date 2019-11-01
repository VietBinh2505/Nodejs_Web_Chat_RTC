function markNotifiCationsAsRead(targetUser) {
    $.ajax({
        url: "/notification/mark-all-as-read",
        type: "put",
        data: { targetUser: targetUser },
        success: function(result) {
            console.log(result);
            if (result) {
                targetUser.forEach((uid) => {
                    $(".noti_content").find(`div[data-uid=${uid}]`).removeClass("notif-readed-false"); //tìm đến các thẻ div có uid trùng với uid trong mảng và xóa đi ở trang chủ thong báo
                    $("ul.list-notifyCations").find(`li>div[data-uid=${uid}]`).removeClass("notif-readed-false"); //tìm đến các thẻ div có uid trùng với uid trong mảng và xóa đi modal
                });
                deCreaseNumberNotification("noti_counter", targetUser.length); //giảm ở ... và số lượng giảm=(targetUser.length)
            }
        },
    });
};
$(document).ready(() => {
    $("#popup-up-mark-as-read").click(() => { // khi user ấn vào đánh dấu tất cả đã đọc tại thông báo
        let targetUser = [];
        $(".noti_content").find("div.notif-readed-false").each((i, notifyCation) => { // trả về mảng, cần lặp để lấy ra uid
            targetUser.push($(notifyCation).data("uid")); // lặp để lấy datauid thêm vào mảng
        });
        if (!targetUser.length) {
            alertify.notify("Tất cả thông báo đã được đọc!", "error", 5);
            return false;
        }
        markNotifiCationsAsRead(targetUser);
    });
    $("#modal-up-mark-as-read").click(() => { // khi user ấn vào đánh dấu tất cả đã đọc tại modal
        let targetUser = [];
        $("ul.list-notifyCations").find("li>div.notif-readed-false").each((i, notifyCation) => { // trả về mảng, cần lặp để lấy ra uid
            targetUser.push($(notifyCation).data("uid")); // lặp để lấy datauid thêm vào mảng
        });
        if (!targetUser.length) {
            alertify.notify("Tất cả thông báo đã được đọc!", "error", 5);
            return false;
        }

        markNotifiCationsAsRead(targetUser);
    });
});