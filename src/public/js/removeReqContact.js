function removeReqContact() {
    $(".user-remove-request-contact").click(() => { // bắt sự kiện khi user click thêm bạn bè
        let targetId = $(".user-remove-request-contact").data("uid"); // lấy id người dùng ở form xóa yêu cầu kp
        $.ajax({
            url: "/contact/remove-req-contact",
            type: "delete",
            data: { uid: targetId },
            success: function(data) {
                if (data.success) {
                    // tìm trong div có thẻ li có id trùng với targetid để ẩn đi
                    $("#find-user").find(`div.user-remove-request-contact[data-uid = ${targetId}]`).hide();
                    $("#find-user").find(`div.user-add-new-contact[data-uid = ${targetId}]`).css("display", "inline-block");
                    deCreaseNumberNotifyfContact("count-request-contact-sent");
                    socket.emit("remove-req-contact", { contactid: targetId }); // soc két đưa ra 1 khẩu lệnh và data chuyền đi là contactid
                }
            },
        });
    });
};
socket.on("response-remove-req-contact", (user) => { //lắng nghe response-add-new-contact đưa dữ liệu vào biến user 
    $(".noti_content").find(`div[data-uid= ${user.id}]`).remove(); //xóa thông báo đi 
    $("ul.list-notifyCations").find(`li>div[data-uid= ${user.id}]`).parent().remove(); //xóa thông báo ở phần modal
    deCreaseNumberNotifyfContact("count-request-contact-received");
    deCreaseNumberNotification("noti_contact_counter"); //số đếm ở quản lý liên lạc
    deCreaseNumberNotification("noti_counter"); // số đếm ở thông báo
});