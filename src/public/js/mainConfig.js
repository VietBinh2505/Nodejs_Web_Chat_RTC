const socket = io();

function nineScrollLeft() {
	$('.left').niceScroll({
		smoothscroll: true,
		horizrailenabled: false,
		cursorcolor: '#ECECEC',
		cursorwidth: '7px',
		scrollspeed: 50
	});
};
function resizenineScrollLeft() {
	$('.left').getNiceScroll().resize();
};

function nineScrollRight(divId) {
	$(`.right .chat[data-chat = ${divId}]`).niceScroll({
		smoothscroll: true,
		horizrailenabled: false,
		cursorcolor: '#ECECEC',
		cursorwidth: '7px',
		scrollspeed: 50
	});
	$(`.right .chat[data-chat = ${divId}]`).scrollTop($(`.right .chat[data-chat = ${divId}]`)[0].scrollHeight);
}

function enableEmojioneArea(divId) {
	$(`#write-chat-${divId}`).emojioneArea({
		standalone: false,
		pickerPosition: 'top',
		filtersPosition: 'bottom',
		tones: false,
		autocomplete: false,
		inline: true,
		hidePickerOnBlur: true,
		search: false,
		shortnames: false,
		events: {
			keyup: function (editor, event) {
				$(`#write-chat-${divId}`).val(this.getText());
			},
			click: function () {
				textAndEmojiChat(divId);
				typingOn(divId);
			},
			blur: function () {
				typingOff(divId);
			}
		},
	});
	$('.icon-chat').bind('click', function (event) {
		event.preventDefault();
		$('.emojionearea-button').click();
		$('.emojionearea-editor').focus();
	});
}

function spinLoaded() {
	$('.master-loader').css('display', 'none');
}

function spinLoading() {
	$('.master-loader').css('display', 'block');
}

function ajaxLoading() {
	$(document)
		.ajaxStart(function () {
			spinLoading();
		})
		.ajaxStop(function () {
			spinLoaded();
		});
}

function showModalContacts() {
	$('#show-modal-contacts').click(function () {
		$(this).find('.noti_contact_counter').fadeOut('slow');
	});
}

function configNotification() {
	$('#noti_Button').click(function () {
		$('#notifications').fadeToggle('fast', 'linear');
		$('.noti_counter').fadeOut('slow');
		return false;
	});
	$(".main-content").click(function () {
		$('#notifications').fadeOut('fast', 'linear');
	});
}

function gridPhotos(layoutNumber) {
	$(".show-images").unbind("click").on("click", function () {
		let href = $(this).attr("href");
		let modalImagesId = href.replace("#", ""); // tìm tất cả dấu # thay thế bằng rỗng
		let originDataImage = $(`#${modalImagesId}`).find("div.modal-body").html();
		let countRows = Math.ceil($(`#${modalImagesId}`).find("div.all-images>img").length / layoutNumber);
		let layoutStr = new Array(countRows).fill(layoutNumber).join("");
		$(`#${modalImagesId}`).find("div.all-images").photosetGrid({
			highresLinks: true,
			rel: "withhearts-gallery",
			gutter: "2px",
			layout: layoutStr,
			onComplete: function () {
				$(`#${modalImagesId}`).find(".all-images").css({
					"visibility": "visible"
				});
				$(`#${modalImagesId}`).find(".all-images a").colorbox({
					photo: true,
					scalePhotos: true,
					maxHeight: "90%",
					maxWidth: "90%"
				});
			}
		});
		//bắt sự kiện đóng modal
		$(`#${modalImagesId}`).on("hidden.bs.modal", function(){
			$(this).find("div.modal.body").html(originDataImage);
		});
	});
}



function flashMasterNotify() {
	let notify = $(".master-success-message").text();
	if (notify.length) {
		alertify.notify(notify, 'success', 10);
	}
}
function changeTypeChat() {
	$("#select-type-chat").bind("change", function () {
		let optionSelected = $("option:selected", this);
		optionSelected.tab("show");
		if ($(this).val() === "user-chat") {
			$(".create-group-chat").hide();
		}
		else {
			$(".create-group-chat").show();
		}
	});
}
function changeScreenChat() {
	$(".room-chat").unbind("click").on("click", function () {
		let divId = $(this).find("li").data("chat");
		$(".person").removeClass("active");
		$(`.person[data-chat=${divId}]`).addClass("active");
		$(this).tab("show");
		//cấu hình thanh cuộn

		nineScrollRight(divId)
		// Bật emoji, tham số truyền vào là id của box nhập nội dung tin nhắn
		enableEmojioneArea(divId);
		imagesChat(divId);
		attachmentChat(divId);
		chatVideo(divId);
	});
};
function bufferToBase64(buffer){
	return btoa(new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), ""));
};
function convertEmojione() {
	$(".convert-emoji").each(function () {
		var original = $(this).html();
		var converted = emojione.toImage(original);
		$(this).html(converted);
	});
};
$(document).ready(function () {
	// Hide số thông báo trên đầu icon mở modal contact
	showModalContacts();
	// Bật tắt popup notification
	configNotification();
	// Cấu hình thanh cuộn
	nineScrollLeft();
	// Icon loading khi chạy ajax
	ajaxLoading();
	// Hiển thị hình ảnh grid slide trong modal tất cả ảnh, tham số truyền vào là số ảnh được hiển thị trên 1 hàng.
	// Tham số chỉ được phép trong khoảng từ 1 đến 5
	gridPhotos(5);

	// Flash message o man hinh master
	flashMasterNotify();
	changeTypeChat();
	changeScreenChat();
	convertEmojione();
	if($("ul.people").find("a").length){
		$("ul.people").find("a")[0].click(); //click vào phần tử đầu tiên	
	}
	$("#video-chat-group").bind("click", function(){
		alertify.notify("Tính năng này chỉ xử dụng được khi trò chuyện cá nhân!", "error", 10);
	});
});

