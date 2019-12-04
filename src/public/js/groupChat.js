function addFriendsToGroup() {
	$("ul#group-chat-friends").find("div.add-user").bind("click", function () {
		let uid = $(this).data("uid");
		$(this).remove();
		let html = $("ul#group-chat-friends").find("div[data-uid=" + uid + "]").html();

		let promise = new Promise(function (resolve, reject) {
			$("ul#friends-added").append(html);
			$("#groupChatModal .list-user-added").show();
			resolve(true);
		});
		promise.then(function (success) {
			$("ul#group-chat-friends").find("div[data-uid=" + uid + "]").remove();
		});
	});
};

function cancelCreateGroup() {
	$("#btn-cancel-group-chat").bind("click", function () {
		$("#groupChatModal .list-user-added").hide();
		if ($("ul#friends-added>li").length) {
			$("ul#friends-added>li").each(function (index) {
				$(this).remove();
			});
		}
	});
};
function callSeachFriend(element) {
	if (element.which === 13 || element.type === "click") { //nếu click và enter
		let keyword = $("#input-search-friends-to-add-group-chat").val(); //dom để lấy keyword người dùng nhập
		let regexKeyword = new RegExp(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/);

		if (!keyword.length) { //kiểm tra chuỗi người dùng nhập
			alertify.notify("Bạn phải nhập thông tin tìm kiếm.!", "error", 6);
			return false;
		}
		if (!regexKeyword.test(keyword)) {
			alertify.notify("Lỗi từ khóa tìm kiếm, bạn chỉ được nhập, chữ cái số và khoảng trống", "error", 6);
			return false;
		}
		$.get(`/contact/seach-friends/${keyword}`, function (data) {
			$("ul#group-chat-friends").html(data);
			// Thêm người dùng vào danh sách liệt kê trước khi tạo nhóm trò chuyện
			addFriendsToGroup();
			// Action hủy việc tạo nhóm trò chuyện
			cancelCreateGroup();
		});
	}
};

function callCreateGroupChat() {
	$("#btn-create-group-chat").unbind("click").on("click", () => {
		let countUser = $("ul.friends-added").find("li");
		if (countUser < 2) {
			alertify.notify("Vui lòng chọn bạn bè đẻ thêm vào nhóm, tối thiểu 2 người.", "error", 10);
			return false;
		}
		let groupChatName = $("#input-name-group-chat").val();
		let regexGroupName = new RegExp(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/);
		if (groupChatName.length < 5 || groupChatName.length > 30 || !regexGroupName.test(groupChatName)) {
			alertify.notify("Vui lòng nhập tên cuộc trò chuyện, giới hạn 5 -> 30 kí tự, và không chứa kí tự đặc biệt", "error", 10);
			return false;
		}
		let arrayIds = [];
		$("ul#friends-added").find("li").each(function (index, item) {
			arrayIds.push({ "userId": $(item).data("uid") });
		});
		Swal.fire({
			title: `Bạn có chắc chắn muốn tạo nhóm &nbsp ${groupChatName}?`,
			type: "info",
			showCancelButton: true,
			confirmButtonColor: "#2ECC71",
			cancelButtonColor: "#ff7675",
			confirmButtonText: "xác nhận!",
			cancelButtonText: "Hủy."
		}).then((result) => {
			if (!result.value) {
				return false;
			}
		});
		$.post("/group-chat/add-new", {
			arrayIds,
			groupChatName,
		}, function (data) {
			//B1: ẩn modal
			$("#input-name-group-chat").val("");
			$("#btn-cancel-group-chat").click()
			$("#groupChatModal").modal("hide");contactsModal
			//B2: thêm vào leftside
			let subGroupChatName = data.groupChat.name;
			if (subGroupChatName.length > 15) {
				subGroupChatName = subGroupChatName.substr(0, 14);
			}
			let leftSideData = `<a href="#uid_${data.groupChat._id}" class="room-chat" data-target="#to_${data.groupChat._id}">
				<li class="person group-chat" data-chat="${data.groupChat._id}">
					<div class="left-avatar">
						<img src="images/users/group-avatar-nvb.png" alt="">
					</div>
					<span class="name">
						<span class="group-chat-name">
							${subGroupChatName} <span>...</span> 
						</span>
					</span>
					<span class="time"></span>
					<span class="preview" convert-emoji></span>
				</li>
	  		</a>`;
			$("#all-chat").find("ul").prepend(leftSideData);
			$("#group-chat").find("ul").prepend(leftSideData);
			//B3: xử lý rightSide
			let rightSideData = `<div class="right tab-pane" data-chat="${data.groupChat._id}"
			id="to_${data.groupChat._id}">
			<div class="top">
				<span>To: <span class="name">${data.groupChat.name}</span></span>
				<span class="chat-menu-right">
					<a href="#attachmentsModal_${data.groupChat._id}" class="show-attachments" data-toggle="modal">
						Tệp đính kèm
						<i class="fa fa-paperclip"></i>
					</a>
				</span>
				<span class="chat-menu-right"><a href="javascript:void(0)">&nbsp;</a></span>
				<span class="chat-menu-right">
					<a href="#imagesModal_${data.groupChat._id}" class="show-images" data-toggle="modal">Hình ảnh<i
							class="fa fa-photo"></i></a>
				</span>
				<span class="chat-menu-right">
					<a href="javascript:void(0)">&nbsp;</a>
				</span>
				<span class="chat-menu-right">
					<a href="javascript:void(0)" class="number-members" data-toggle="modal">
						<span class="show-number-members">${data.groupChat.usersAmout}</span>
						<i class="fa fa-users"></i>
					</a>
				</span>
				<span class="chat-menu-right">
					<a href="javascript:void(0)">&nbsp;</a>
				</span>
				<span class="chat-menu-right">
					<a href="javascript:void(0)" class="number-message" data-toggle="modal">
						<span class="show-number-message">${data.groupChat.messagesAmount}</span>
						<i class="fa fa-comment-o"></i>
					</a>
				</span>
			</div>
			<div class="content-chat">
				<div class="chat" data-chat="${data.groupChat._id}">
				</div>
			</div>
			<div class="write" data-chat="${data.groupChat._id}">
				<input type="text" class="write-chat chat-in-group" id="write-chat-${data.groupChat._id}"
					data-chat="${data.groupChat._id}" />
				<div class="icons">
					<a href="#" class="icon-chat" data-chat="${data.groupChat._id}"><i class="fa fa-smile-o"></i></a>
					<label for="image-chat-${data.groupChat._id}">
						<input type="file" id="image-chat-${data.groupChat._id}" name="my-image-chat"
							class="image-chat chat-in-group" data-chat="${data.groupChat._id}" />
						<i class="fa fa-photo"></i>
					</label>
					<label for="attachment-chat-${data.groupChat._id}">
						<input type="file" id="attachment-chat-${data.groupChat._id}" name="my-attachment-chat"
							class="attachment-chat chat-in-group" data-chat="${data.groupChat._id}" />
						<i class="fa fa-paperclip"></i>
					</label>
					<a href="javascript:void(0)" id="video-chat-group">
						<i class="fa fa-video-camera"></i>
					</a>
				</div>
			</div>
		</div>`;
		$("#screen-chat").prepend(rightSideData);
		//B4: call function changscreenChat
		changeScreenChat();
		//B5: Bật modal hình ảnh
		let imageModalData = `<div class="modal fade" id="imagesModal_${data.groupChat._id}" role="dialog">
		<div class="modal-dialog modal-lg">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal">&times;</button>
					<h4 class="modal-title">Những hình ảnh trong cuộc trò chuyện. </h4>
				</div>
				<div class="modal-body">
					<div class="all-images" style="visibility: hidden;">
					</div>
				</div>
			</div>
		</div>
		</div>`;
		$("body").append(imageModalData);
		//B6: call function gridPhoto
		gridPhotos(5);
		//B7: Bật modal tệp tin
		let attachmentsModalData = `<div class="modal fade" id="attachmentsModal_${data.groupChat._id}" role="dialog">
		<div class="modal-dialog modal-lg">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal">&times;</button>
					<h4 class="modal-title">Tất cả tệp tin.</h4>
				</div>
				<div class="modal-body">
					<ul class="list-attachments"></ul>
				</div>
			</div>
		</div>
		</div>`;
	  	$("body").append(attachmentsModalData);
	  	//B8 emit sự kiện khi tạo mới group
		socket.emit("new-group-created", {groupChat: data.groupChat});
		//B9 emit khi member có 1 groupchat
		//B10 cập nhật trực tuyến
		socket.emit("check-status");
		}).fail(function (response) {
			alertify.notify(response.responseText, "error", 10);
		});
	});
};

$(document).ready(function () {
	$("#input-search-friends-to-add-group-chat").bind("keypress", callSeachFriend);
	$("#btn-search-friends-to-add-group-chat").bind("click", callSeachFriend);
	callCreateGroupChat();
	socket.on("response-new-group-created", (response)=>{
		//B1: ẩn modal
		//B2: thêm vào leftside
		let subGroupChatName = response.groupChat.name;
		if (subGroupChatName.length > 15) {
			subGroupChatName = subGroupChatName.substr(0, 14);
		}
		let leftSideData = `<a href="#uid_${response.groupChat._id}" class="room-chat" data-target="#to_${response.groupChat._id}">
			<li class="person group-chat" data-chat="${response.groupChat._id}">
				<div class="left-avatar">
					<img src="images/users/group-avatar-nvb.png" alt="">
				</div>
				<span class="name">
					<span class="group-chat-name">
						${subGroupChatName} <span>...</span> 
					</span>
				</span>
				<span class="time"></span>
				<span class="preview" convert-emoji></span>
			</li>
			</a>`;
		$("#all-chat").find("ul").prepend(leftSideData);
		$("#group-chat").find("ul").prepend(leftSideData);
		//B3: xử lý rightSide
		let rightSideData = `<div class="right tab-pane" data-chat="${response.groupChat._id}"
		id="to_${response.groupChat._id}">
		<div class="top">
			<span>To: <span class="name">${response.groupChat.name}</span></span>
			<span class="chat-menu-right">
				<a href="#attachmentsModal_${response.groupChat._id}" class="show-attachments" data-toggle="modal">
					Tệp đính kèm
					<i class="fa fa-paperclip"></i>
				</a>
			</span>
			<span class="chat-menu-right"><a href="javascript:void(0)">&nbsp;</a></span>
			<span class="chat-menu-right">
				<a href="#imagesModal_${response.groupChat._id}" class="show-images" data-toggle="modal">Hình ảnh<i
						class="fa fa-photo"></i></a>
			</span>
			<span class="chat-menu-right">
				<a href="javascript:void(0)">&nbsp;</a>
			</span>
			<span class="chat-menu-right">
				<a href="javascript:void(0)" class="number-members" data-toggle="modal">
					<span class="show-number-members">${response.groupChat.usersAmout}</span>
					<i class="fa fa-users"></i>
				</a>
			</span>
			<span class="chat-menu-right">
				<a href="javascript:void(0)">&nbsp;</a>
			</span>
			<span class="chat-menu-right">
				<a href="javascript:void(0)" class="number-message" data-toggle="modal">
					<span class="show-number-message">${response.groupChat.messagesAmount}</span>
					<i class="fa fa-comment-o"></i>
				</a>
			</span>
		</div>
		<div class="content-chat">
			<div class="chat" data-chat="${response.groupChat._id}">
			</div>
		</div>
		<div class="write" data-chat="${response.groupChat._id}">
			<input type="text" class="write-chat chat-in-group" id="write-chat-${response.groupChat._id}"
				data-chat="${response.groupChat._id}" />
			<div class="icons">
				<a href="#" class="icon-chat" data-chat="${response.groupChat._id}"><i class="fa fa-smile-o"></i></a>
				<label for="image-chat-${response.groupChat._id}">
					<input type="file" id="image-chat-${response.groupChat._id}" name="my-image-chat"
						class="image-chat chat-in-group" data-chat="${response.groupChat._id}" />
					<i class="fa fa-photo"></i>
				</label>
				<label for="attachment-chat-${response.groupChat._id}">
					<input type="file" id="attachment-chat-${response.groupChat._id}" name="my-attachment-chat"
						class="attachment-chat chat-in-group" data-chat="${response.groupChat._id}" />
					<i class="fa fa-paperclip"></i>
				</label>
				<a href="javascript:void(0)" id="video-chat-group">
					<i class="fa fa-video-camera"></i>
				</a>
			</div>
		</div>
	</div>`;
		$("#screen-chat").prepend(rightSideData);
		//B4: call function changscreenChat
		changeScreenChat();
		console.log(response.groupChat._id);
		//B5: Bật modal hình ảnh
		let imageModalData = `<div class="modal fade" id="imagesModal_${response.groupChat._id}" role="dialog">
		<div class="modal-dialog modal-lg">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal">&times;</button>
					<h4 class="modal-title">Những hình ảnh trong cuộc trò chuyện. </h4>
				</div>
				<div class="modal-body">
					<div class="all-images" style="visibility: hidden;">
					</div>
				</div>
			</div>
		</div>
		</div>`;
		$("body").append(imageModalData);
		//B6: call function gridPhoto
		gridPhotos(5);
		//B7: Bật modal tệp tin
		let attachmentsModalData = `<div class="modal fade" id="attachmentsModal_${response.groupChat._id}" role="dialog">
		<div class="modal-dialog modal-lg">
			<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal">&times;</button>
					<h4 class="modal-title">Tất cả tệp tin.</h4>
				</div>
				<div class="modal-body">
					<ul class="list-attachments"></ul>
				</div>
			</div>
		</div>
		</div>`;
		$("body").append(attachmentsModalData);
		//B8 emit sự kiện khi tạo mới group
		//B9 emit khi member có 1 groupchat
		socket.emit("member-received-group-chat", {groupChatId: response.groupChat._id});
		//B10 cập nhật trực tuyến
		socket.emit("check-status");
	});
});