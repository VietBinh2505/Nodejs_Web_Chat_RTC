import { PushSocketIdSocketArray, EmitNotifiToArray, RemoveSocketIdFromToArray } from "./../../helpers/socketHelper";
let addNewContact = (io) => {
    let clients = {};
    io.on("connection", (socket) => {
        clients = PushSocketIdSocketArray(clients, socket.request.user._id, socket.id); // kiểm tra điều kiện bên sockethelpers
        socket.on("add-new-contact", (data) => { // lắng nghe sự kiện từ add-new-contact(truyền tới full info usercrr)
            let userCrr = { // khởi thông tin user hiện tại
                id: socket.request.user.id, // id
                username: socket.request.user.username, // tên
                avatar: socket.request.user.avatar, // avatar
                address: (socket.request.user.address !== null) ? socket.request.user.address : "",
            };
            if (clients[data.contactid]) {
                EmitNotifiToArray(clients, data.contactid, io, "response-add-new-contact", userCrr);
            }
        });
        socket.on("disconnect", () => {
            clients = RemoveSocketIdFromToArray(clients, socket.request.user._id, socket);
        });
    });
};
module.exports = addNewContact;