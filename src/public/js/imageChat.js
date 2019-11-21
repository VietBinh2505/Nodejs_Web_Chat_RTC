function bufferToBase64(buffer){
	return btoa(new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), ""));
};

function imagesChat(divId) {  
	$(`#image-chat-${divId}`).unbind("change").on("change", function(){
		let fileData = $(this).prop("files")[0];
		let math = ["image/png", "image/jpg", "image/jpeg"];
		let limit = 1048576; // 1MB
		if ($.inArray(fileData.type, math) === -1) {
			alertify.notify("Kiểu file không hợp lệ chỉ chấp nhận jpg & png", "error", 6);
			$(this).val(null);
			return false;
		}
		if (fileData.size > limit) {
			alertify.notify("Ảnh vượt quá dung lượng 1MB", "error", 6);
			$(this).val(null);
			return false;
		}
		let targetId = $(this).data("chat");
		let isChatGroup = false;
		let messageFormData = new FormData();
		messageFormData.append("my-image-chat", fileData);
		messageFormData.append("uid", targetId);
		if($(this).hasClass("chat-in-group")){
			messageFormData.append("isChatGroup", true);
			isChatGroup = true;
		}
		$.ajax({
			url: "/message/add-new-image",
			type: "post",
			cache: false, // chỉ dùng for upload file
			contentType: false, // chỉ dùng for upload file
			processData: false, // chỉ dùng for upload file
			data: messageFormData,
			success: function (data) {
				console.log(data);
				let dataToEmit = {
					message: data.message,
				};
				//Bước 1:xử lý tin nhắn trước khi hiển thị
				let messageOfMe = $(`<div class="bubble me bubble-image-file" data-mess-id="${data.message._id}"></div>`);
				let imageChat = `<img src="data:${data.message.file.contentType}; base64, ${bufferToBase64(data.message.file.data.data)}" class="show-image-chat" />`;
				if (isChatGroup) { //nếu trò chuyện nhóm
					let senderAvatar = `<img src="/images/users/${data.message.sender.avatar}" class="avatar-small" title="${data.message.sender.name}"/>`;
					messageOfMe.html(`${senderAvatar} ${imageChat}`);
					increaseNumberMessageGroup(divId);
					dataToEmit.groupId = targetId; //id của group
				} else {//nếu trò chuyện cá nhân
					let senderAvatar = `<img src="/images/users/${data.message.sender.avatar}" class="avatar-small" title="${data.message.sender.name}"/>`;
					messageOfMe.html(`${senderAvatar} ${imageChat}`);
					//messageOfMe.html(imageChat);
					dataToEmit.contactId = targetId; //id của cá nhân
				}
				//Bước 2:chuyển đổi định dang tin nhắn
				$(`.right .chat[data-chat=${divId}]`).append(messageOfMe);
				nineScrollRight(divId);
				//Bước 3:cập nhật tin nhắn ở leftside
				$(`.person[data-chat=${divId}]`).find("span.time").removeClass("message-time-realtime").html(moment(data.message.createdAt).locale("vi").startOf("seconds").fromNow());
				$(`.person[data-chat=${divId}]`).find("span.preview").html("Hình ảnh...");
				//Bước 4:thay đổi vị trí top khi nhắn tin (leftside)
				$(`.person[data-chat=${divId}]`).on("dat_ten_gi_cung_duoc.moveConversationToTheTop", function () {
					let dataToMove = $(this).parent();
					$(this).closest("ul").prepend(dataToMove); //tìm thẻ ul gần nhất và thêm dataToMove lên trên nó
					$(this).off("dat_ten_gi_cung_duoc.moveConversationToTheTop"); //tắt sự kiện click moveConversationToTheTop ngay lập tức
				});
				
				$(`.person[data-chat=${divId}]`).trigger("dat_ten_gi_cung_duoc.moveConversationToTheTop");
				socket.emit("chat-image", dataToEmit);
				//Bước 5
				//Bước 6
				//Bước 7
				//Bước 8: thêm ảnh vào modal
				let imageChatAddToModal = `<img src="data:${data.message.file.contentType}; base64, ${bufferToBase64(data.message.file.data.data)}">`;
				$(`#imagesModal_${divId}`).find("div.all-images").append(imageChatAddToModal);
			},
			error: function (error) {
				alertify.notify(error.responseText, "error", 5);
				console.log("loi tai imagesChat/js/public");
				console.log(error);
			},
		});
	});
};

$(document).ready(function(){
	socket.on("response-chat-image", function(response){
		let divId = "";
		//Bước 1:xử lý tin nhắn trước khi hiển thị
		let messageOfYou = $(`<div class="bubble you bubble-image-file" data-mess-id="${response.message._id}"></div>`);
		let imageChat = `<img src="data:${response.message.file.contentType}; base64, ${bufferToBase64(response.message.file.data.data)}" class="show-image-chat" />`;
		if (response.CrrGroupId) { //nếu trò chuyện nhóm
			let senderAvatar = `<img src="/images/users/${response.message.sender.avatar}"class="avatar-small" title="${response.message.sender.name}"/>`;
			messageOfYou.html(`${senderAvatar} ${imageChat}`);
			divId = response.CrrGroupId; //(id cuả group)
			if (response.CrrUserId !== $("#dropdown-navbar-user").data("uid")) {
				increaseNumberMessageGroup(divId);
			}
		} else {//nếu trò chuyện cá nhân
			let senderAvatar = `<img src="/images/users/${response.message.sender.avatar}"class="avatar-small" title="${response.message.sender.name}"/>`;
			messageOfYou.html(`${senderAvatar} ${imageChat}`);
			//messageOfYou.html(imageChat);
			divId = response.CrrUserId;//(id cuả user)
		}
		//Bước 2:chuyển đổi định dạng tin nhắn
		if (response.CrrUserId !== $("#dropdown-navbar-user").data("uid")) {
			$(`.right .chat[data-chat=${divId}]`).append(messageOfYou); //thêm tin nhắn vào div có id lấy từ phía trên
			nineScrollRight(divId);
			$(`.person[data-chat=${divId}]`).find("span.time").addClass("message-time-realtime"); //hiển thị đỏ đỏ
		}
		//Bước 3:cập nhật tin nhắn ở leftside (người nhận thì không cần);
		$(`.person[data-chat=${divId}]`).find("span.time").html(moment(response.message.createdAt).locale("vi").startOf("seconds").fromNow());
		$(`.person[data-chat=${divId}]`).find("span.preview").html("Hình ảnh...");
		//Bước 4:thay đổi vị trí top khi nhận nhắn tin (leftside)
		$(`.person[data-chat=${divId}]`).on("dat_ten_gi_cung_duoc.moveConversationToTheTop", function () {
			let dataToMove = $(this).parent();
			$(this).closest("ul").prepend(dataToMove); //tìm thẻ ul gần nhất và thêm dataToMove lên trên nó
			$(this).off("dat_ten_gi_cung_duoc.moveConversationToTheTop"); //tắt sự kiện click moveConversationToTheTop ngay lập tức
		});
		$(`.person[data-chat=${divId}]`).trigger("dat_ten_gi_cung_duoc.moveConversationToTheTop");
		//Bước 5
		//Bước 6
		//Bước 7
		//Bước 8: realtime thêm ảnh vào modal
		if (response.CrrUserId !== $("#dropdown-navbar-user").data("uid")) {
			let imageChatAddToModal = `<img src="data:${response.message.file.contentType}; base64, ${bufferToBase64(response.message.file.data.data)}">`;
			$(`#imagesModal_${divId}`).find("div.all-images").append(imageChatAddToModal);
		}
	});
});