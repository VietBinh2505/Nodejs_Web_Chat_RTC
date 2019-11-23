import { pushSocketIdToArray, emitNotifyToArray, reoveSocketIdFromArray } from "../../helper/socketHelper";

let chatVideo = (io) => {
	let clients = {};
	io.on("connection", (socket) => {
		let currentUserId = socket.request.user._id;
		clients = pushSocketIdToArray(clients, currentUserId, socket.id);
		socket.request.user.chatGrIds.forEach(group => {
			clients = pushSocketIdToArray(clients, group._id, socket.id);
		});
		
		socket.on("caller-check-listener-online-or-not", (data) => {
			if(clients[data.listenerId]){ //online
				let response = {
					callerId: socket.request.user._id, //id người gọi
					listenerId: data.listenerId, //id người nhận
					callerName: data.callerName,//tên người gọi
				}
				emitNotifyToArray(clients, data.listenerId, io, "server-request-peer-id-off-listener", response);
         }else{//offline
            socket.emit("server-send-listener-offline");
         } 
		});
		socket.on("listen-emit-peer-id-to-server", (data) => {
			let response = {
				callerId: data.callerId, //id người gọi
				listenerId: data.listenerId, //id người nhận
				callerName: data.callerName,//tên người gọi
				listenerPeerId: data.listenerPeerId, //id của người nhận khi open
				listenerName: data.listenerName, //Tên người nhận cuộc gọi
			};
			if(clients[data.callerId]){
				emitNotifyToArray(clients, data.callerId, io, "server-send-peerId-of-listener-to-caller", response);
			}
		});
		socket.on("caller-request-call-to-server", (data) => {
			let response = {
				callerId: data.callerId, //id người gọi
				listenerId: data.listenerId, //id người nhận
				callerName: data.callerName,//tên người gọi
				listenerPeerId: data.listenerPeerId, //id của người nhận khi open
				listenerName: data.listenerName, //Tên người nhận cuộc gọi
			};
			if(clients[data.listenerId]){
				emitNotifyToArray(clients, data.listenerId, io, "server-send-request-call-to-listener", response);
			}
		});
		socket.on("caller-cancel-request-call-to-server", (data) => {
			let response = {
				callerId: data.callerId, //id người gọi
				listenerId: data.listenerId, //id người nhận
				callerName: data.callerName,//tên người gọi
				listenerPeerId: data.listenerPeerId, //id của người nhận khi open
				listenerName: data.listenerName, //Tên người nhận cuộc gọi
			};
			if(clients[data.listenerId]){
				emitNotifyToArray(clients, data.listenerId, io, "server-send-cancel-request-call-to-listener", response);
			}
		});
		socket.on("listener-reject-request-call-to-server", (data) => {
			let response = {
				callerId: data.callerId, //id người gọi
				listenerId: data.listenerId, //id người nhận
				callerName: data.callerName,//tên người gọi
				listenerPeerId: data.listenerPeerId, //id của người nhận khi open
				listenerName: data.listenerName, //Tên người nhận cuộc gọi
			};
			if(clients[data.callerId]){
				emitNotifyToArray(clients, data.callerId, io, "server-send-reject-call-to-caller", response);
			}
		});
		socket.on("listener-accept-request-call-to-server", (data) => {
			let response = {
				callerId: data.callerId, //id người gọi
				listenerId: data.listenerId, //id người nhận
				callerName: data.callerName,//tên người gọi
				listenerPeerId: data.listenerPeerId, //id của người nhận khi open
				listenerName: data.listenerName, //Tên người nhận cuộc gọi
			};
			if(clients[data.callerId]){
				emitNotifyToArray(clients, data.callerId, io, "server-send-accept-to-caller", response);
			}
			if(clients[data.listenerId]){
				emitNotifyToArray(clients, data.listenerId, io, "server-send-accept-to-listener", response);
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

module.exports = chatVideo;