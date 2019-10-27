function removeReqContact() {
    $(".user-remove-request-contact").click(() => {
        let targetId = $(".user-remove-request-contact").data("uid");
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
                }
            }
        });
    });
};