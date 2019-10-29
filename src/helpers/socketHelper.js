export let PushSocketIdSocketArray = (clients, userid, socketid) => {
    if (clients[userid]) { // nếu user đã đăng nhập
        clients[userid].push(socketid); // thêm id của socket vào mảng
    } else { // user chưa đăng nhập 
        clients[userid] = [socketid];
    }
    return clients
};
export let EmitNotifiToArray = (clients, userid, io, eventName, data) => {
    clients[userid].forEach(socketid => { // nếu 1 user mở 2 tab thì gửi về cả 2
        return io.sockets.connected[socketid].emit(eventName, data); // phát về toàn bộ những ai đang connect tới database khẩu lệnh, có dữ liệu là userCrr
    });
};
export let RemoveSocketIdFromToArray = (clients, userid, socket) => {
    clients[userid] = clients[userid].filter(socketid => { // filter: lấy ra tất cả giá trị thỏa mãn với đk
        return socketid !== socket.id; // khi disconnect sẽ ra 1 socket.id mới và hàm này xẽ xóa id cũ đi
    });

    if (!clients[userid].length) { // user tắt hoàn toàn, không còn socket.id nào
        delete clients[userid];
    }
    return clients;
};