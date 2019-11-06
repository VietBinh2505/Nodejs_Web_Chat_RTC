import { PushSocketIdSocketArray, EmitNotifiToArray, RemoveSocketIdFromToArray } from "../../helpers/socketHelper";

let removeReqContactSent = (io) => {
    let clients = {};
    io.on("connection", (socket) => { // bắt sự kiện khi người dùng truy cập
        clients = PushSocketIdSocketArray(clients, socket.request.user._id, socket.id); // kiểm tra điều kiện bên sockethelpers
        socket.on("remove-req-contact-sent", (data) => { // lắng nghe sự kiện từ add-new-contact(truyền tới full info usercrr)
            let userCrr = { // khởi thông tin user hiện tại
                id: socket.request.user._id, // id
            };
            if (clients[data.contactid]) {
                EmitNotifiToArray(clients, data.contactid, io, "response-remove-req-contact-sent", userCrr);
            }
        });
        socket.on("disconnect", () => { // khi user thoát khỏi trình duyệt
            clients = RemoveSocketIdFromToArray(clients, socket.request.user._id, socket);
        });
    });
};
module.exports = removeReqContactSent;