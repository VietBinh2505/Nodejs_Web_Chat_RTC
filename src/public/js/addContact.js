import { Socket } from "dgram";

function addContact() {
    $(".user-add-new-contact").click(() => {
        let targetid = $(".user-add-new-contact").data("uid");
        $.post("/contact/add-new", { uid: targetid }, (data) => {
            if (data.success) {
                $("#find-user").find(`div.user-add-new-contact[data-uid = ${targetid}]`).hide();
                $("#find-user").find(`div.user-remove-request-contact[data-uid = ${targetid}]`).css("display", "block");
                increaseNumberNotifContact("count-request-contact-sent");
                socket.emit("add-new-contact", { contactId: targetid });
            }
        });
    });
}