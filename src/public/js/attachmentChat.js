function attachmentChat(divId){
   $(`#attachment-chat-${divId}`).unbind("change").on("change", function(){
      let fileData = $(this).prop("files")[0];
		let limit = 1048576; // 1MB
		if (fileData.size > limit) {
			alertify.notify("Tệp tin vượt quá dung lượng 1MB", "error", 6);
			$(this).val(null);
			return false;
      }
      
		let targetId = $(this).data("chat");
		let isChatGroup = false;
		let messageFormData = new FormData();
		messageFormData.append("my-attachment-chat", fileData);
		messageFormData.append("uid", targetId);
		
		if($(this).hasClass("chat-in-group")){
			messageFormData.append("isChatGroup", true);
			isChatGroup = true;
		}
      $.ajax({
			url: "/message/add-new-attachment",
			type: "post",
			cache: false, // chỉ dùng for upload file
			contentType: false, // chỉ dùng for upload file
			processData: false, // chỉ dùng for upload file
			data: messageFormData,
			success: function (data) {
            let dataToEmit = {
					message: data.message,
				};
				//Bước 1:xử lý tin nhắn trước khi hiển thị
				let messageOfMe = $(`<div class="bubble me bubble-attachment-file" data-mess-id="${data.message._id}"></div>`);
				let attachment = `<a href="data:${data.message.file.contentType}; base64, ${bufferToBase64(data.message.file.data.data)}" download="${data.message.file.fileName}">${data.message.file.fileName}</a>`;
				let senderAvatar = `<img src="/images/users/${data.message.sender.avatar}" class="avatar-small" title="${data.message.sender.name}"/>`;
				if (isChatGroup) { //nếu trò chuyện nhóm
					messageOfMe.html(`${senderAvatar} ${attachment}`);
					increaseNumberMessageGroup(divId);
					dataToEmit.groupId = targetId; //id của group
				} else {//nếu trò chuyện cá nhân
					messageOfMe.html(`${senderAvatar} ${attachment}`);
					//messageOfMe.html(attachment);
					dataToEmit.contactId = targetId; //id của cá nhân
				}
				//Bước 2:chuyển đổi định dang tin nhắn
				$(`.right .chat[data-chat=${divId}]`).append(messageOfMe);
				nineScrollRight(divId);
				//Bước 3:cập nhật tin nhắn ở leftside
				$(`.person[data-chat=${divId}]`).find("span.time").removeClass("message-time-realtime").html(moment(data.message.createdAt).locale("vi").startOf("seconds").fromNow());
				$(`.person[data-chat=${divId}]`).find("span.preview").html("Tệp đính kèm...");
				//Bước 4:thay đổi vị trí top khi nhắn tin (leftside)
				$(`.person[data-chat=${divId}]`).on("dat_ten_gi_cung_duoc.moveConversationToTheTop", function () {
					let dataToMove = $(this).parent();
					$(this).closest("ul").prepend(dataToMove); //tìm thẻ ul gần nhất và thêm dataToMove lên trên nó
					$(this).off("dat_ten_gi_cung_duoc.moveConversationToTheTop"); //tắt sự kiện click moveConversationToTheTop ngay lập tức
				});
				
				$(`.person[data-chat=${divId}]`).trigger("dat_ten_gi_cung_duoc.moveConversationToTheTop");
				socket.emit("chat-attachment", dataToEmit);
				//Bước 5
				//Bước 6
				//Bước 7
				//Bước 8: thêm ảnh vào attachments
				//let attachmentChatAddToModal = `<li><a href="data:${data.message.file.contentType}; base64,${bufferToBase64(data.message.file.data.data)}" download="${data.message.file.fileName}">${data.message.file.fileName}</a></li>`;
				//$(`#attachmentsModal_${divId}`).find("ul.list-attachments").append(attachmentChatAddToModal);
			},
			error: function (error) {
				alertify.notify(error.responseText, "error", 10);
				console.log("loi tai attachmentChat/js/public");
			},
		});
   });
};

$(document).ready(function(){
	socket.on("response-chat-attachment", (response)=>{
		let divId = "";
		//Bước 1:xử lý tin nhắn trước khi hiển thị
		let messageOfYou = $(`<div class="bubble you bubble-attachment-file" data-mess-id="${response.message._id}"></div>`);
		let attachment = `<a href="data:${response.message.file.contentType}; base64, ${bufferToBase64(response.message.file.data.data)}" download="${response.message.file.fileName}">${response.message.file.fileName}</a>`;
		if (response.CrrGroupId) { //nếu trò chuyện nhóm
			let senderAvatar = `<img src="/images/users/${response.message.sender.avatar}"class="avatar-small" title="${response.message.sender.name}"/>`;
			messageOfYou.html(`${senderAvatar} ${attachment}`);
			divId = response.CrrGroupId; //(id cuả group)
			if (response.CrrUserId !== $("#dropdown-navbar-user").data("uid")) {
				increaseNumberMessageGroup(divId);
			}
		} else {//nếu trò chuyện cá nhân
			let senderAvatar = `<img src="/images/users/${response.message.sender.avatar}"class="avatar-small" title="${response.message.sender.name}"/>`;
			messageOfYou.html(`${senderAvatar} ${attachment}`);
			//messageOfYou.html(attachment);
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
		$(`.person[data-chat=${divId}]`).find("span.preview").html("Tệp đính kèm...");
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
		let attachmentChatAddToModal = `<li><a href="data:${response.message.file.contentType}; base64,${bufferToBase64(response.message.file.data.data)}" download="${response.message.file.fileName}">${response.message.file.fileName}</a></li>`;
		$(`#attachmentsModal_${divId}`).find("ul.list-attachments").append(attachmentChatAddToModal);
	});
});

