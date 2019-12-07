function readMoreMessage(){ // xem thêm tin nhắn
   $(".right .chat").unbind("scroll").on("scroll", function(){
      //tìm đến tin nhắn đầu tiên
      let firstMessage = $(this).find(".bubble:first");
      let currentOffset = firstMessage.offset().top - $(this).scrollTop();
      if($(this).scrollTop() === 0){ // khi người dùng cuộn lên tìm tin nhắn cũ hơn
         let messageLoading = `<img src="images/chat/message-loading.gif" class="message-loading" />`;
         $(this).prepend(messageLoading);
         let thisDom = $(this);
         let targetId = $(this).data("chat");
         let skipMessage = $(this).find("div.bubble").length;
         let chatInGroup = $(this).hasClass("chat-in-group") ? true : false;
         $.get(`/message/read-more?skipMessage=${skipMessage}&targetId=${targetId}&chatInGroup=${chatInGroup}`, function(data){
            if(data.rightSideData.trim() === ""){
               alertify.notify("Bạn không còn tin nhắn nào để xem thêm!", "error", 6);
               thisDom.find("img.message-loading").remove();
               return false;
            }
            //B1: xử lý rightSide
            $(`.right .chat[data-chat=${targetId}]`).prepend(data.rightSideData);
            //B2: thêm thanh cuộn
            $(`.right .chat[data-chat=${targetId}]`).scrollTop( firstMessage.offset().top - currentOffset);
            //B3: chuyển đổi emoji
            convertEmojione();
            //B4: xử lý IMGModal
            $(`#imagesModal_${targetId}`).find("div.all-images").append(data.imageModalData);
            //B5: grid Photos
            gridPhotos(5);
            //B6: xử lý ATTModal
            $(`#attachmentsModal_${targetId}`).find("ul.list-attachments").append(data.attactmentModalData);
            //B7: xóa message loading
            thisDom.find("img.message-loading").remove();
         });
      }
   });
};
$(document).ready(function(){
   readMoreMessage();
});