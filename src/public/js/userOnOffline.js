//B1nhận danh sách các user onl từ server gửi về
socket.on("server-send-list-user-online", (listUserids)=>{ //listuserids mảng các id user onl
   listUserids.forEach(userId => {
      $(`.person[data-chat=${userId}]`).find("div.dot").addClass("online");
      $(`.person[data-chat=${userId}]`).find("img").addClass("avatar-online");
   });
});

//B2khi ai đó vừa onl
socket.on("server-send-when-new-user-onl", (userId)=>{
   $(`.person[data-chat=${userId}]`).find("div.dot").addClass("online");
   $(`.person[data-chat=${userId}]`).find("img").addClass("avatar-online");
});

//B3khi ai đó vừa off
socket.on("server-send-list-user-Offline", (userId)=>{ //listuserids mảng các id user onl
      $(`.person[data-chat=${userId}]`).find("div.dot").removeClass("online");
      $(`.person[data-chat=${userId}]`).find("img").removeClass("avatar-online");
});