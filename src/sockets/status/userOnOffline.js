import { pushSocketIdToArray, emitNotifyToArray, reoveSocketIdFromArray } from "./../../helper/socketHelper";

let typingOn = (io) => {
	let clients = {};
	io.on("connection", (socket) => {
		let currentUserId = socket.request.user._id; //lấy được id người dùng hiện tại
		clients = pushSocketIdToArray(clients, currentUserId, socket.id); //lấy được hết id người dùng hiện tại cho vào 1 mảng
		socket.request.user.chatGrIds.forEach(group => {
			clients = pushSocketIdToArray(clients, group._id, socket.id); //lấy được hết id người dùng hiện tại đang truy cập vào nhóm cho vào 1 mảng
		});
      //B1: Khi người dùng đăng nhập truyền ngay về cho user
      let listUserOnline = Object.keys(clients); // lấy các user đang online cho vào mảng
		socket.emit("server-send-list-user-online", listUserOnline);
		//B2: khi ai đó vừa onl thì truyền về cho tất cả
		socket.broadcast.emit("server-send-when-new-user-onl", socket.request.user._id);
		
		socket.on("disconnect", () => {
			clients = reoveSocketIdFromArray(clients, currentUserId, socket.id);
			socket.request.user.chatGrIds.forEach((group) => {
				clients = reoveSocketIdFromArray(clients, group._id, socket.id);
			});
			socket.broadcast.emit("server-send-list-user-Offline", socket.request.user._id);
		});
	});
};

module.exports = typingOn;