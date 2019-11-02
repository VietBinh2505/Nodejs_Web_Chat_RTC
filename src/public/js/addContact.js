function addContact() { // thêm bạn bè
    $(".user-add-new-contact").click(() => {
        let targetId = $(".user-add-new-contact").data("uid");
        $.post("/contact/add-new", { uid: targetId }, (data) => {
            if (data.success) {
                // tìm trong div có thẻ li có id trùng với targetid để ẩn đi
                $("#find-user").find(`div.user-add-new-contact[data-uid = ${targetId}]`).hide();
                $("#find-user").find(`div.user-remove-request-contact[data-uid = ${targetId}]`).css("display", "inline-block");
                inCreaseNumberNotifyfContact("count-request-contact-sent");
                // thêm ở modal tab đang chờ xác nhận
                let userinfoHTML = $("#find-user").find(`ul li[data-uid = ${targetId}]`).get(0).outerHTML; // lấy toàn bộ info user số 0(đầu tiên) (html) 
                $("#request-contact-sent").find("ul").prepend(userinfoHTML);
                socket.emit("add-new-contact", { contactid: targetId });
            }
        });
    });
};

socket.on("response-add-new-contact", (user) => { //lắng nghe response-add-new-contact đưa dữ liệu vào biến user 
    let notify = `<div class="notif-readed-false" data-uid="${ user.id }"> 
                    <img class="avatar-small" src="images/users/${user.avatar}"alt="">
                    <strong>${ user.username }</strong> đã gửi cho bạn một lời mời kết bạn!
                </div>`; // nội dung câu thông báo
    $(".noti_content").prepend(notify); //prepend sắp xếp từ trước về sau, ngược với append
    $("ul.list-notifyCations").prepend(`<li>${notify}</li>`);
    inCreaseNumberNotifyfContact("count-request-contact-received");
    inCreaseNumberNotification("noti_contact_counter", 1); //số đếm ở quản lý liên lạc
    inCreaseNumberNotification("noti_counter", 1); // số đếm ở thông báo
    // thêm ở modal tab đang chờ yêu cầu kết bạn
    let userinfoHTML = `<li class="_contactList" data-uid="${ user.id }">
        <div class="contactPanel">
            <div class="user-avatar"><img src="images/users/${user.avatar}" alt=""></div>
            <div class="user-name"> <p>${ user.username }</p></div>
            <br>
            <div class="user-address"><span>${ user.address }</span></div>
            <div class="user-acccept-contact-received" data-uid="${ user.id }">Chấp nhận</div>
            <div class="user-reject-request-contact-received action-danger" data-uid="${ user.id }">Xóa yêu cầu</div>
        </div>
    </li>`;
    $("#request-contact-received").find("ul").prepend(userinfoHTML);
});