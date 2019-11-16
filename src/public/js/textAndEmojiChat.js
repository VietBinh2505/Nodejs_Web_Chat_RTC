function textAndEmojiChat(divId) {
	$(".emojionearea").unbind("keyup").on("keyup", function(element){
		if(element.which === 13){
			let targetId = $(`#write-chat-${divId}`).data("chat"); //lấy ra id của nhóm trò chuyện hoặc cá nhân
			let messageVal = $(`#write-chat-${divId}`).val(); //lấy ra nội dung tin nhắn user nhập
			if(!targetId.length || !messageVal.length){
				return false;
			}
			let dataTextEmojiForSend = {
				uid: targetId,//lấy ra id của nhóm trò chuyện hoặc cá nhân
				messageVal: messageVal, //lấy ra nội dung tin nhắn user nhập
			};
			if($(`#write-chat-${divId}`).hasClass("chat-in-group")){
				dataTextEmojiForSend.isChatGroup = true;
			}
			$.post("/message/add-new-text-emoji",dataTextEmojiForSend, function(data){
				console.log(data.message);
			}).fail(function(response){ //nếu có lỗi
				alertify.notify(response.responseText, "error", 5);
				console.log("loi tai textAndEmojiChat/js/public");
				console.log(response);
			});
		}
	});
};