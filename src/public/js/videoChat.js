function chatVideo(divId) {
   $(`#video-chat-${divId}`).unbind("click").on("click", function () {
      let targetId = $(this).data("chat");
      let callerName = $("#navbar-username").text(); //lấy được tên người dùng hiện tại
      let dataToEmit = {
         listenerId: targetId, //id người nhận cuộc gọi
         callerName,//id người nhận cuộc gọi
      };
      //Bước 1: kiểm tra xem người nhận có online hay không?
      socket.emit("caller-check-listener-online-or-not", dataToEmit);
   });
};
function playVideoStream(videoTagId, stream) {
   console.log(videoTagId);
   let video = document.getElementById(videoTagId); //lấy được thẻ video ở view
   video.srcObject = stream;
   video.onloadeddata = function () {
      video.play(); //chay video len
   };
};
function closeVideoStream(stream) {
   return stream.getTracks().forEach(track => track.stop());
};
$(document).ready(function () {
   /*sau khi người dùng emit lên server check người nhận có onl hay không, nếu ko onl thì thực hiện các bước sau
   B2: nhận câu trả lời của server khi người nhận không online*/
   socket.on("server-send-listener-offline", () => {
      alertify.notify("Người này hiện không online.", "error", 10);
   });
   let timerInterval;
   const peer = new Peer({
      key: "peerjs",
      host: "server-peerjs-nvb.herokuapp.com",
      secure: true,
      port: 443,
      debug: 3,
   });
   let getPeerId = "";
   peer.on("open", (peerId) => { //mỗi lần f5 sẽ tạo ra 1 peerId khác nhau
      getPeerId = peerId;
   });
   /*sau khi người dùng emit lên server check người nhận có onl hay không, nếu ko onl thì thực hiện các bước sau
   B3: nhận câu trả lời của server khi người nhận online*/
   socket.on("server-request-peer-id-off-listener", (response) => { //nếu online
      let listenerName = $("#navbar-username").text(); //lấy được tên người dùng hiện tại
      let dataToEmit = {
         callerId: response.callerId, //id người gọi
         listenerId: response.listenerId, //id người nhận
         callerName: response.callerName,//tên người gọi
         listenerPeerId: getPeerId, //id của người nhận khi open
         listenerName: listenerName, //Tên người nhận cuộc gọi
      };
      //B4: người nhận cuộc gọi trả lời và gửi thông tin đến server
      socket.emit("listen-emit-peer-id-to-server", dataToEmit);
   });
   /*sau khi người nhận gửi info lên server 
   B5: nhận câu trả lời của server khi người nhận cuộc gọi gửi info lên*/
   socket.on("server-send-peerId-of-listener-to-caller", (response) => {
      let dataToEmit = {
         callerId: response.callerId, //id người gọi
         listenerId: response.listenerId, //id người nhận
         callerName: response.callerName,//tên người gọi
         listenerName: response.listenerName, //Tên người nhận cuộc gọi
         listenerPeerId: response.listenerPeerId, //id của người nhận khi open
      };
      //B6: người gọi yêu cầu server gọi
      socket.emit("caller-request-call-to-server", dataToEmit);
      Swal.fire({
         title: `Đang gọi cho &nbsp<span style="color: #2ECC71">${response.listenerName}<span>&nbsp <i class="fa fa-volume-control-phone"><i>`,
         html: `Thời gian: <strong style="color: #d43f3a;"></strong> giây. <br/><br/>
         <button id="btn-cancel-call" class="btn btn-danger">
            Hủy cuộc gọi.
         </button>`,
         backdrop: "rgba(85, 85,85, 0.4)",
         width: "52rem",
         timer: 30000,
         allowOutsideClick: false,
         onBeforeOpen: () => {
            $("#btn-cancel-call").unbind("click").on("click", function () {
               Swal.close();
               clearInterval(timerInterval);
               //b7: hủy cuộc gọi
               socket.emit("caller-cancel-request-call-to-server", dataToEmit);
            });
            if (Swal.getContent().querySelector) {
               Swal.showLoading();
               timerInterval = setInterval(() => {
                  Swal.getContent().querySelector("strong").textContent = Math.ceil(Swal.getTimerLeft() / 1000);
               }, 1000);
            }
         },
         onOpen: () => {
            //B12: server trả về khi người nghe hủy yêu cầu
            socket.on("server-send-reject-call-to-caller", (response) => {
               Swal.close();
               clearInterval(timerInterval);
               Swal.fire({
                  title: `<span style="color: #2ECC71">${response.listenerName}<span>&nbsp;Hiện không thể nghe máy.`,
                  backdrop: "rgba(85, 85,85, 0.4)",
                  width: "52rem",
                  allowOutsideClick: false,
                  confirmButtonColor: "#2ECC71",
                  confirmButtonText: "xác nhận!",
               });
            });
         },
         onClose: () => {
            clearInterval(timerInterval);
         }
      }).then((result) => {
         return false;
      });
   });
   //B8: lắng nghe cuộc gọi
   socket.on("server-send-request-call-to-listener", (response) => {
      let dataToEmit = {
         callerId: response.callerId, //id người gọi
         listenerId: response.listenerId, //id người nhận
         callerName: response.callerName,//tên người gọi
         listenerName: response.listenerName, //Tên người nhận cuộc gọi
         listenerPeerId: response.listenerPeerId, //id của người nhận khi open
      };
      Swal.fire({
         title: `<span style="color: #2ECC71">${response.callerName}<span>&nbsp;Muốn trò chuyện video với bạn.&nbsp <i class="fa fa-volume-control-phone"><i>`,
         html: `Thời gian: <strong style="color: #d43f3a;"></strong> giây. <br/><br/>
         <button id="btn-reject-call" class="btn btn-danger">
            Từ chối.
         </button>
         <button id="btn-accept-call" class="btn btn-danger">
            Xác nhận.
         </button>`,
         backdrop: "rgba(85, 85,85, 0.4)",
         width: "52rem",
         timer: 30000,
         allowOutsideClick: false,
         onBeforeOpen: () => {
            $("#btn-reject-call").unbind("click").on("click", function () { //khi click Từ chối
               Swal.close();
               clearInterval(timerInterval);
               //b10: hủy cuộc gọi từ người nghe
               socket.emit("listener-reject-request-call-to-server", dataToEmit);
            });
            $("#btn-accept-call").unbind("click").on("click", function () {//khi click Xác nhận
               //b11: Xác nhận cuộc gọi
               socket.emit("listener-accept-request-call-to-server", dataToEmit);
            });
            Swal.showLoading();
            timerInterval = setInterval(() => {
               Swal.getContent().querySelector("strong").textContent = Math.ceil(Swal.getTimerLeft() / 1000);
            }, 1000);
         },
         onOpen: () => {
            //B9: server trả về sự kiện người nghe từ chối cuộc gọi
            socket.on("server-send-cancel-request-call-to-listener", (response) => {
               Swal.close();
               clearInterval(timerInterval);
            });

         },
         onClose: () => {
            clearInterval(timerInterval);
         },
      }).then((result) => {
         return false;
      });
   });
   //B13: server trả về khi người nghe xác nhận cuộc gọi
   socket.on("server-send-accept-call-to-caller", (response) => {
      Swal.close();
      clearInterval(timerInterval);
      let getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia).bind(navigator);
      getUserMedia({ video: true, audio: true }, function (stream) { //video: true, audio: true: bật camera, video
         $("#streamModal").modal("show"); //show modal lên trước khi gọi
         playVideoStream("local-stream", stream); //chạy video, tham số 1 id lấy từ view
         let call = peer.call(response.listenerPeerId, stream); //tham số 1 truyền địa chỉ cần gọi đến
         //đang lắng nghe xem người nhận có xác nhận trò chuyện hay không
         call.on("stream", function (remoteStream) {
            playVideoStream("remote-stream", remoteStream); //chạy video, tham số 1 id lấy từ view
         });
         //đóng modal stream
         $("#streamModal").on("hidden.bs.modal", function () {
            closeVideoStream(stream);
            Swal.fire({
               title: `Đã kết thúc cuộc trò chuyện với<span style="color: #2ECC71">${response.listenerName}</span>`,
               backdrop: "rgba(85, 85,85, 0.4)",
               width: "52rem",
               allowOutsideClick: false,
               confirmButtonColor: "#2ECC71",
               confirmButtonText: "Xác nhận",
            });
         });
      }, function (err) {
         if(err.toString() === "NotAllowedError: Permission denied"){
            alertify.notify("Thiết bị nghe gọi chưa được cấp quyền.", "error", 10);
         }
         if(err.toString() === "NotFoundError: Requested device not found"){
            alertify.notify("Máy tính của bạn không hỗ trợ nghe gọi..", "error", 10);
         }
      });
   });
   //B14: server trả về sự kiện người nghe xác nhận cuộc gọi
   socket.on("server-send-accept-call-to-listener", (response) => {
      Swal.close();
      clearInterval(timerInterval);
      let getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia).bind(navigator);
      peer.on("call", function (call) {
         getUserMedia({ video: true, audio: true }, function (stream) {
            $("#streamModal").modal("show"); //show modal lên trước khi gọi
            playVideoStream("local-stream", stream); //chạy video, tham số 1 id lấy từ view
            call.answer(stream); //trả lời cho thằng gọi đến
            call.on("stream", function (remoteStream) {
               playVideoStream("remote-stream", remoteStream); //chạy video, tham số 1 id lấy từ view
            });
            //đóng modal stream
            $("#streamModal").on("hidden.bs.modal", function () {
               closeVideoStream(stream);
               Swal.fire({
                  title: `Đã kết thúc cuộc trò chuyện với<span style="color: #2ECC71">${response.callerName}</span>`,
                  backdrop: "rgba(85, 85,85, 0.4)",
                  width: "52rem",
                  allowOutsideClick: false,
                  confirmButtonColor: "#2ECC71",
                  confirmButtonText: "Xác nhận",
               });
            });
         }, function (err) {
            if(err.toString() === "NotAllowedError: Permission denied"){
               alertify.notify("Thiết bị nghe gọi chưa được cấp quyền.", "error", 10);
            }
            if(err.toString() === "NotFoundError: Requested device not found"){
               alertify.notify("Máy tính của bạn không hỗ trợ nghe gọi..", "error", 10);
            }
         });
      });
   });
});
