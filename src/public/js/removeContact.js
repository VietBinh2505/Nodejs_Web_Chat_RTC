function removeContact() {
	$(".user-remove-contact").unbind().on("click", function () {
		let targetId = $(this).data("uid");
		let username = $(this).parent().find("div.user-name p").text(); // lấy username
		Swal.fire({
			title: `Bạn có chắc chắn muốn xóa ${username} khỏi danh bạ?`,
			text: "Bạn không thể hoàn tác lại quá trình này.!",
			type: "warning",
			showCancelButton: true,
			confirmButtonColor: "#2ECC71",
			cancelButtonColor: "#ff7675",
			confirmButtonText: "xác nhận!",
			cancelButtonText: "Hủy."
		}).then((result) => {
			if (!result.value) {
				return false;
			}
			$.ajax({
				url: "/contact/remove-contact",
				type: "delete",
				data: { uid: targetId },
				success: function (data) {
					if (data.success) {
						$("#contacts").find(`ul li[data-uid = ${targetId}]`).remove();
						decreaseNumberNotifContact("count-contacts");
						socket.emit("remove-contact", { contactId: targetId });
						//B0: kiểm tra cuộc trò chuyện muốn xóa có active(hiện ở rightside hay không)
						let checkActive = $("#all-chat").find(`li[data-chat = ${targetId}]`).hasClass("active");
						//B1: Đóng modal (ko cần), xóa các ul ở modal
						$("#all-chat").find(`ul a[href = "#uid_${targetId}"]`).remove();
						$("#user-chat").find(`ul a[href = "#uid_${targetId}"]`).remove();
						//B2: xóa khỏi rightside
						$("#screen-chat").find(`div#to_${targetId}`).remove();
						//B3: xóa modal hình ảnh
						$("body").find(`#imagesModal_${targetId}`).remove();
						//B4: xóa modal tập tin
						$("body").find(`#attachmentsModal_${targetId}`).remove();
						//B5 sau khi xóa user , rightside hiện màn hình chta của cuộc trò chuyện tiếp theo
						if(checkActive){
							$("ul.people").find("a")[0].click();
						}
					}
				},
			});
		});
	});
};

socket.on("response-remove-contact", function (user) {
	$("#contacts").find(`ul li[data-uid = ${user.id}]`).remove();
	decreaseNumberNotifContact("count-contacts");
	//B0: kiểm tra cuộc trò chuyện muốn xóa có active(hiện ở rightside hay không)
	let checkActive = $("#all-chat").find(`li[data-chat = ${user.id}]`).hasClass("active");
	//B1: Đóng modal (ko cần), xóa các ul ở modal
	$("#all-chat").find(`ul a[href = "#uid_${user.id}"]`).remove();
	$("#user-chat").find(`ul a[href = "#uid_${user.id}"]`).remove();
	//B2: xóa khỏi rightside
	$("#screen-chat").find(`div#to_${user.id}`).remove();
	//B3: xóa modal hình ảnh
	$("body").find(`#imagesModal_${user.id}`).remove();
	//B4: xóa modal tập tin
	$("body").find(`#attachmentsModal_${user.id}`).remove();
	//B5 sau khi xóa user , rightside hiện màn hình chta của cuộc trò chuyện tiếp theo
	if(checkActive){
		$("ul.people").find("a")[0].click();
	}
});

$(document).ready(function () {
	removeContact();
});

