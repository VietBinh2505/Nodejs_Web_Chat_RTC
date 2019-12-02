import { pushSocketIdToArray, emitNotifyToArray, reoveSocketIdFromArray } from "./../../helper/socketHelper";

let newGroupChat = (io) => {
	let clients = {};
	io.on("connection", (socket) => {
		let currentUserId = socket.request.user._id; //lấy được id người dùng hiện tại
		clients = pushSocketIdToArray(clients, currentUserId, socket.id); //lấy được hết id người dùng hiện tại cho vào 1 mảng
		socket.request.user.chatGrIds.forEach(group => {
			clients = pushSocketIdToArray(clients, group._id, socket.id); //lấy được hết id người dùng hiện tại đang truy cập vào nhóm cho vào 1 mảng
		});
		socket.on("new-group-created", (data) => {
			clients = pushSocketIdToArray(clients, data.groupChat._id, socket.id); //lấy được hết id người dùng hiện tại đang truy cập vào nhóm cho vào 1 mảng
         let response = {
            groupChat: data.groupChat,
         };
         data.groupChat.members.forEach(member => {
            if(clients[member.userId] && member.userId != currentUserId){
               emitNotifyToArray(clients, member.userId, io, "response-new-group-created", response);
            }
         });
		});
		socket.on("member-received-group-chat", (data)=>{
			clients = pushSocketIdToArray(clients, data.groupChatId, socket.id); //lấy được hết id người dùng hiện tại đang truy cập vào nhóm cho vào 1 mảng
        
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

module.exports = newGroupChat;