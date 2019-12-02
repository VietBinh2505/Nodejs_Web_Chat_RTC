import { pushSocketIdToArray, emitNotifyToArray, reoveSocketIdFromArray } from "./../../helper/socketHelper";

let chatimage = (io) => {
	let clients = {};
	io.on("connection", (socket) => {
		let currentUserId = socket.request.user._id;
		clients = pushSocketIdToArray(clients, currentUserId, socket.id);
		socket.request.user.chatGrIds.forEach(group => {
			clients = pushSocketIdToArray(clients, group._id, socket.id);
		});
		socket.on("new-group-created", (data) => {
			clients = pushSocketIdToArray(clients, data.groupChat._id, socket.id); //lấy được hết id người dùng hiện tại đang truy cập vào nhóm cho vào 1 mảng
		});
		socket.on("member-received-group-chat", (data)=>{
			clients = pushSocketIdToArray(clients, data.groupChatId, socket.id); //lấy được hết id người dùng hiện tại đang truy cập vào nhóm cho vào 1 mảng
		});
		socket.on("chat-image", (data) => {
			if (data.groupId) {
				let response = {
					CrrGroupId: data.groupId,
					CrrUserId: currentUserId,
					message: data.message,
				};
				//emit notification
				if (clients[data.groupId]) {
					emitNotifyToArray(clients, data.groupId, io, "response-chat-image", response);
				}
			}
			if (data.contactId) {
				let response = {
					CrrUserId: currentUserId,
					message: data.message,
				};
				//emit notification
				if (clients[data.contactId]) {
					emitNotifyToArray(clients, data.contactId, io, "response-chat-image", response);
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

module.exports = chatimage;