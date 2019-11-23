function textAndEmojiChat(divId) {
	$(".emojionearea").unbind("keyup").on("keyup", function (element) {
		let currentemojionearea = $(this);
		if (element.which === 13) {
			let targetId = $(`#write-chat-${divId}`).data("chat"); //lấy ra id của nhóm trò chuyện hoặc cá nhân
			let messageVal = $(`#write-chat-${divId}`).val(); //lấy ra nội dung tin nhắn user nhập
			if (!targetId.length || !messageVal.length) {
				return false;
			}
			let dataTextEmojiForSend = {
				uid: targetId,//lấy ra id của nhóm trò chuyện hoặc cá nhân
				messageVal: messageVal, //lấy ra nội dung tin nhắn user nhập
			};
			if ($(`#write-chat-${divId}`).hasClass("chat-in-group")) {
				dataTextEmojiForSend.isChatGroup = true;
			}
			$.post("/message/add-new-text-emoji", dataTextEmojiForSend, function (data) {
				let dataToEmit = {
					message: data.message,
				};
				//Bước 1:xử lý tin nhắn trước khi hiển thị
				let messageOfMe = $(`<div class="bubble me" data-mess-id="${data.message._id}"></div>`);
				messageOfMe.text(data.message.text);
				let converEmojiMessage = emojione.toImage(messageOfMe.html());
				if (dataTextEmojiForSend.isChatGroup) { //nếu trò chuyện nhóm
					let senderAvatar = `<img src="/images/users/${data.message.sender.avatar}" class="avatar-small" title="${data.message.sender.name}"/>`;
					messageOfMe.html(`${senderAvatar} ${converEmojiMessage}`);
					increaseNumberMessageGroup(divId);
					dataToEmit.groupId = targetId; //id của group
				} else {//nếu trò chuyện cá nhân
					let senderAvatar = `<img src="/images/users/${data.message.sender.avatar}" class="avatar-small" title="${data.message.sender.name}"/>`;
					messageOfMe.html(`${senderAvatar} ${converEmojiMessage}`);
					//messageOfMe.html(converEmojiMessage);
					dataToEmit.contactId = targetId; //id của cá nhân
				}
				//Bước 2:chuyển đổi định dang tin nhắn
				$(`.right .chat[data-chat=${divId}]`).append(messageOfMe);
				nineScrollRight(divId);
				//xoá tin nhắn ở ô input khi gửi tin đi
				$(`#write-chat-${divId}`).val("");
				currentemojionearea.find(".emojionearea-editor").text("");
				//Bước 3:cập nhật tin nhắn ở leftside
				$(`.person[data-chat=${divId}]`).find("span.time").removeClass("message-time-realtime").html(moment(data.message.createdAt).locale("vi").startOf("seconds").fromNow());
				$(`.person[data-chat=${divId}]`).find("span.preview").html(emojione.toImage(data.message.text));
				//Bước 4:thay đổi vị trí top khi nhắn tin (leftside)
				$(`.person[data-chat=${divId}]`).on("dat_ten_gi_cung_duoc.moveConversationToTheTop", function () {
					let dataToMove = $(this).parent();
					$(this).closest("ul").prepend(dataToMove); //tìm thẻ ul gần nhất và thêm dataToMove lên trên nó
					$(this).off("dat_ten_gi_cung_duoc.moveConversationToTheTop"); //tắt sự kiện click moveConversationToTheTop ngay lập tức
				});
				$(`.person[data-chat=${divId}]`).trigger("dat_ten_gi_cung_duoc.moveConversationToTheTop");
				//Bước 5:chức năng real-time
				socket.emit("chat-text-emoji", dataToEmit);
				//Bước 6:chức năng xóa typing real-time
				typingOff(divId);
				//Bước 7:chức năng xóa typing nế nó đã tồn tại
				let checkTyping = $(`.chat[data-chat=${divId}]`).find("div.bubble-typing-gif");
				if(checkTyping.length){
					checkTyping.remove();
				}
			}).fail(function (response) { //nếu có lỗi
				alertify.notify(response.responseText, "error", 10);
				console.log("loi tai textAndEmojiChat/js/public");
				console.log(response);
			});
		}
	});
};
$(document).ready(function () {
	socket.on("response-chat-text-emoji", function (response) {
		let divId = "";
		//Bước 1:xử lý tin nhắn trước khi hiển thị
		let messageOfYou = $(`<div class="bubble you" data-mess-id="${response.message._id}"></div>`);
		messageOfYou.text(response.message.text);
		let converEmojiMessage = emojione.toImage(messageOfYou.html());
		if (response.CrrGroupId) { //nếu trò chuyện nhóm
			let senderAvatar = `<img src="/images/users/${response.message.sender.avatar}"class="avatar-small" title="${response.message.sender.name}"/>`;
			messageOfYou.html(`${senderAvatar} ${converEmojiMessage}`);
			divId = response.CrrGroupId; //(id cuả group)
			if (response.CrrUserId !== $("#dropdown-navbar-user").data("uid")) {
				increaseNumberMessageGroup(divId);
			}
		} else {//nếu trò chuyện cá nhân
			let senderAvatar = `<img src="/images/users/${response.message.sender.avatar}"class="avatar-small" title="${response.message.sender.name}"/>`;
			messageOfYou.html(`${senderAvatar} ${converEmojiMessage}`);
			//messageOfYou.html(converEmojiMessage);
			divId = response.CrrUserId;//(id cuả user)
		}
		//Bước 2:chuyển đổi định dạng tin nhắn
		if (response.CrrUserId !== $("#dropdown-navbar-user").data("uid")) {
			$(`.right .chat[data-chat=${divId}]`).append(messageOfYou); //thêm tin nhắn vào div có id lấy từ phía trên
			nineScrollRight(divId);
			$(`.person[data-chat=${divId}]`).find("span.time").addClass("message-time-realtime");
		}
		//Bước 3:cập nhật tin nhắn ở leftside (người nhận thì không cần);
		$(`.person[data-chat=${divId}]`).find("span.time").html(moment(response.message.createdAt).locale("vi").startOf("seconds").fromNow());
		$(`.person[data-chat=${divId}]`).find("span.preview").html(emojione.toImage(response.message.text));
		//Bước 4:thay đổi vị trí top khi nhận nhắn tin (leftside)
		$(`.person[data-chat=${divId}]`).on("dat_ten_gi_cung_duoc.moveConversationToTheTop", function () {
			let dataToMove = $(this).parent();
			$(this).closest("ul").prepend(dataToMove); //tìm thẻ ul gần nhất và thêm dataToMove lên trên nó
			$(this).off("dat_ten_gi_cung_duoc.moveConversationToTheTop"); //tắt sự kiện click moveConversationToTheTop ngay lập tức
		});
		$(`.person[data-chat=${divId}]`).trigger("dat_ten_gi_cung_duoc.moveConversationToTheTop");
	});
});