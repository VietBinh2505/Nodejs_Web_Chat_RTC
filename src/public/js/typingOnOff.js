function typingOn(divId){
	let targetId = $(`#write-chat-${divId}`).data("chat"); //lấy id người đang chat
	if ($(`#write-chat-${divId}`).hasClass("chat-in-group")) {
		socket.emit("user-is-typing", {groupId: targetId}); // chuyền cho server 
	}else{
		socket.emit("user-is-typing", {contactId: targetId});
	}
};
function typingOff(divId){
	let targetId = $(`#write-chat-${divId}`).data("chat"); //lấy id người đang chat
	if ($(`#write-chat-${divId}`).hasClass("chat-in-group")) {
		socket.emit("user-is-not-typing", {groupId: targetId}); // chuyền cho server 
	}else{
		socket.emit("user-is-not-typing", {contactId: targetId});
	}
};
 
$(document).ready(function(){
	//lắng nghe typing on
	socket.on("response-user-is-typing", function(response){
		let messageTyping = `<div class="bubble you bubble-typing-gif"><img src="/images/chat/typing.gif"/><div>`;
		if(response.CrrGroupId){ //tồn tại id của gr
			if (response.CrrUserId !== $("#dropdown-navbar-user").data("uid")) {
				let checkTyping = $(`.chat[data-chat=${response.CrrGroupId}]`).find("div.bubble-typing-gif");
				if(checkTyping.length){
					return false;
				}
				$(`.chat[data-chat=${response.CrrGroupId}]`).append(messageTyping); //tìm đến màn hình chát của group theo id và thêm hình ảnh chat.gif
				nineScrollRight(response.CrrGroupId);
			}
		}else{
			let checkTyping = $(`.chat[data-chat=${response.CrrUserId}]`).find("div.bubble-typing-gif");
			if(checkTyping.length){
				return false;
			}
			$(`.chat[data-chat=${response.CrrUserId}]`).append(messageTyping); //tìm đến màn hình chát của group theo id và thêm hình ảnh chat.gif
			nineScrollRight(response.CrrUserId);
		}
	});
	//lắng nghe typing off
	socket.on("response-user-is-not-typing", function(response){
		if(response.CrrGroupId){ //tồn tại id của gr
			if (response.CrrUserId !== $("#dropdown-navbar-user").data("uid")) {
				$(`.chat[data-chat=${response.CrrGroupId}]`).find("div.bubble-typing-gif").remove();
				nineScrollRight(response.CrrGroupId);
			}
		}else{
			$(`.chat[data-chat=${response.CrrUserId}]`).find("div.bubble-typing-gif").remove();
			nineScrollRight(response.CrrUserId);
		}
	});
});