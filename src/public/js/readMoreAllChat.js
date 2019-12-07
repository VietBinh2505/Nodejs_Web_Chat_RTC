$(document).ready(function () {
	$("#link-read-more-all-chat").bind("click", function() {
		let skipPersonal = $("#all-chat").find("li:not(.group-chat)").length; //xem thêm của cá nhân
		let skipGroup = $("#all-chat").find("li.group-chat").length; //xem thêm của nhóm
		$("#link-read-more-all-chat").css("display", "none");
		$(".read-more-all-chat-loader").css("display", "inline-block");
		$.get(`/message/read-more-all-chat?skipPersonal=${skipPersonal}&skipGroup=${skipGroup}`, function (data) {
			if(data.leftSideData.trim() === ""){ // nếu dữ liệu đã hết
				alertify.notify("Bạn không còn cuộc trò chuyện nào để xem thêm.!", "error", 6);
				$("#link-read-more-all-chat").css("display", "inline-block");
				$(".read-more-all-chat-loader").css("display", "none");
				return false;
			}
			//nếu dữ liệu đổ ra leftside vẫn còn
			//B1: xử lý leftside
			$("#all-chat").find("ul").append(data.leftSideData);
			//B2: xử lý phần cuộn bên trái
			resizenineScrollLeft();
			nineScrollLeft();
			//B3: xử lý rightside
			$("#screen-chat").append(data.rightSideData);
			//B4: gọi changeScreenChat
			changeScreenChat();
			//B5: xử lý chuyển đổi emoji
			convertEmojione();
			//B6: xử lý imageModal
			$("body").append(data.imageModal);
			//B7: call function gridPhoto
			gridPhotos(5);
			//B8: xử lý attactmentModal
			$("body").append(data.attactmentModal);
			//B9: kiểm tra online
			socket.emit("check-status");
			//B10: xoá loading
			$("#link-read-more-all-chat").css("display", "inline-block");
			$(".read-more-all-chat-loader").css("display", "none");
			//B11: gọi readMoreMessage
			readMoreMessage();
		});
	});
});