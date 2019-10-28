function addContact() { // thêm bạn bè
    $(".user-add-new-contact").click(() => {
        let targetId = $(".user-add-new-contact").data("uid");
        $.post("/contact/add-new", { uid: targetId }, (data) => {
            if (data.success) {
                // tìm trong div có thẻ li có id trùng với targetid để ẩn đi
                $("#find-user").find(`div.user-add-new-contact[data-uid = ${targetId}]`).hide();
                $("#find-user").find(`div.user-remove-request-contact[data-uid = ${targetId}]`).css("display", "inline-block");
                inCreaseNumberNotifyfContact("count-request-contact-sent");
                socket.emit("add-new-contact", { contactid: targetId });
            }
        });
    });
};