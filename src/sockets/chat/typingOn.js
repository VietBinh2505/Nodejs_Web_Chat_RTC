import { pushSocketIdToArray, emitNotifyToArray, reoveSocketIdFromArray } from "./../../helper/socketHelper";

let typingOn = (io) => {
	let clients = {};
	io.on("connection", (socket) => {
		let currentUserId = socket.request.user._id; //lấy được id người dùng hiện tại
		clients = pushSocketIdToArray(clients, currentUserId, socket.id); //lấy được hết id người dùng hiện tại cho vào 1 mảng
		socket.request.user.chatGrIds.forEach(group => {
			clients = pushSocketIdToArray(clients, group._id, socket.id); //lấy được hết id người dùng hiện tại đang truy cập vào nhóm cho vào 1 mảng
		});
		socket.on("user-is-typing", (data) => {
			if (data.groupId) { // nếu là trò chuyện nhóm
				let response = {
					CrrGroupId: data.groupId,
					CrrUserId: currentUserId,
				};
				//emit notification
				if (clients[data.groupId]) {
					emitNotifyToArray(clients, data.groupId, io, "response-user-is-typing", response);
				}
			}
			if (data.contactId) {//nếu là trò chuyện cá nhân
				let response = {
					CrrUserId: currentUserId,
				};
				//emit notification
				if (clients[data.contactId]) {
					emitNotifyToArray(clients, data.contactId, io, "response-user-is-typing", response);
				}
			}
		});
		socket.on("disconnect", () => {
			// remove socket when user user disconnect
			clients = reoveSocketIdFromArray(clients, currentUserId, socket.id);
			socket.request.user.chatGrIds.forEach((group) => {
				clients = reoveSocketIdFromArray(clients, group._id, socket.id);
			});
		});
	});
};

module.exports = typingOn;