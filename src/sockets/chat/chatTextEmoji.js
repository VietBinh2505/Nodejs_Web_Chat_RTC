import { pushSocketIdToArray, emitNotifyToArray, reoveSocketIdFromArray } from "./../../helper/socketHelper";

let chatTextEmoji = (io) => {
	let clients = {};
	io.on("connection", (socket) => {
		let currentUserId = socket.request.user._id;
		clients = pushSocketIdToArray(clients,currentUserId, socket.id);
		socket.request.user.chatGrIds.forEach(group=>{
			clients = pushSocketIdToArray(clients, group._id, socket.id);
		});
		socket.on("chat-text-emoji", (data)=>{
			if (data.groupId) {
				let response = {
					CrrGroupId: data.groupId,
					CrrUserId:currentUserId,
					message: data.message,
				};
				//emit notification
				if (clients[data.groupId]) {
					emitNotifyToArray(clients, data.groupId, io, "response-chat-text-emoji", response);
				}
			}
			if (data.contactId) {
				let response = {
					CrrUserId: currentUserId,
					message: data.message,
				};
				//emit notification
				if (clients[data.contactId]) {
					emitNotifyToArray(clients, data.contactId, io, "response-chat-text-emoji", response);
				}
			}
		});
		socket.on("disconnect", () => {
			// remove socket when user user disconnect
			clients = reoveSocketIdFromArray(clients, currentUserId, socket.id);
			socket.request.user.chatGrIds.forEach((group)=>{
				clients = reoveSocketIdFromArray(clients, group._id, socket.id);
			});
		});
	});
};

module.exports = chatTextEmoji;