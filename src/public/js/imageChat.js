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
		let messageFormData = new FormData();
		messageFormData.append("my-image-chat", fileData);
		messageFormData.append("uid", targetId);
		if($(this).hasClass("chat-in-group")){
			messageFormData.append("isChatGroup", true);
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
			},
			error: function (error) {
				alertify.notify(error.responseText, "error", 5);
				console.log("loi tai imagesChat/js/public");
				console.log(error);
			}
		});
	});
};