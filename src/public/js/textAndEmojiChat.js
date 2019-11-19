function textAndEmojiChat(divId) {
	$(".emojionearea").unbind("keyup").on("keyup", function(element){
		let currentemojionearea = $(this);
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
				let messageOfMe = $(`<div class="bubble me data-mess-id= ${data.message._id}"></div>`);
				//xử lý tin nhắn trước khi hiển thị
				if(dataTextEmojiForSend.isChatGroup){ //nếu trò chuyện nhóm
					messageOfMe.html(`<img src="/images/users/${data.message.sender.avatar}" class="avatar-small" title="${data.message.sender.name}">`);
					messageOfMe.text(data.message.text);
					increaseNumberMessageGroup(divId);
				}else{//nếu trò chuyện cá nhân
					messageOfMe.text(data.message.text);
				}
				//chuyển đổi định dang tin nhắn
				let converEmojiMessage = emojione.toImage(messageOfMe.html());
				messageOfMe.html(converEmojiMessage);
				$(`.right .chat[data-chat=${divId}]`).append(messageOfMe);
				nineScrollRight(divId);
				//xoá tin nhắn ở ô input khi gửi tin đi
				$(`#write-chat-${divId}`).val("");
				currentemojionearea.find(".emojionearea-editor").text("");
				//cập nhật tin nhắn ở leftside
				$(`.person[data-chat=${divId}]`).find("span.time").html(moment(data.message.createdAt).locale("vi").startOf("seconds").fromNow());
				$(`.person[data-chat=${divId}]`).find("span.preview").html(emojione.toImage(data.message.text));
				//thay đổi vị trí top khi nhắn tin (leftside)
				$(`.person[data-chat=${divId}]`).on("click.moveConversationToTheTop", function(){
					let dataToMove = $(this).parent();
					$(this).closest("ul").prepend(dataToMove); //tìm thẻ ul gần nhất và thêm dataToMove lên trên nó
					$(this).off("click.moveConversationToTheTop"); // tắt sự kiện click moveConversationToTheTop ngay lập tức
				});
				$(`.person[data-chat=${divId}]`).click(); 
			}).fail(function(response){ //nếu có lỗi
				alertify.notify(response.responseText, "error", 5);
				console.log("loi tai textAndEmojiChat/js/public");
				console.log(response);
			});
		}
	});
};	