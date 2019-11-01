import notificationMD from "./../models/NotificationModels";
import UserMD from "./../models/UserModels"
let getNotifiCations = (UserIdCRR, limit) => { // kiểm tra max 10 bản ghi
    return new Promise(async(resolve, reject) => {
        try {
            let notifications = await notificationMD.model.getByUserIdAndLimit(UserIdCRR, limit = 10); // lấy ra toàn bộ collection trong database notify
            let getNotifiContent = notifications.map(async(notifiCation) => { // gần giống foreach, map sẽ trả về 1 mảng mới
                let sender = await UserMD.findUserbyId(notifiCation.senderid); // lấy thông tin của người dùng theo senderid
                return notificationMD.content.getContent(notifiCation.type, notifiCation.isRead, sender._id, sender.username, sender.avatar);
                // dòng 9: truyền tham số để lấy được thông báo khi người dùng gửi yêu cầu kết bạn
            });
            resolve(await Promise.all(getNotifiContent));
        } catch (error) {
            reject(error);
        }
    });
};
let countNotifiUnread = (UserIdCRR) => { // đếm tất cả thông báo
    return new Promise(async(resolve, reject) => {
        try {
            let notificationsUnread = await notificationMD.model.countNotifiUnread(UserIdCRR)
            resolve(notificationsUnread);
        } catch (error) {
            reject(error);
        }
    });
};
let readMore = (id, skipNumberNoti, limit) => {
    return new Promise(async(resolve, reject) => {
        try {
            let newNotifications = await notificationMD.model.readMore(id, skipNumberNoti, limit = 10);
            let getNotifiContent = newNotifications.map(async(notifiCation) => { // gần giống foreach, map sẽ trả về 1 mảng mới
                let sender = await UserMD.findUserbyId(notifiCation.senderid); // lấy thông tin của người dùng theo senderid
                return notificationMD.content.getContent(notifiCation.type, notifiCation.isRead, sender._id, sender.username, sender.avatar);
                // dòng 9: truyền tham số để lấy được thông báo khi người dùng gửi yêu cầu kết bạn
            });
            resolve(await Promise.all(getNotifiContent));
        } catch (error) {
            reject(error);
        }
    });
};
let markAllRead = (id, targetUser) => {
    return new Promise(async(resolve, reject) => {
        try {
            await notificationMD.model.markAllRead(id, targetUser)
            resolve(true);
        } catch (error) {
            console.log(`Lỗi khi đánh dấu đã đọc ${error}`);
            reject(false);
        }
    });
};
module.exports = {
    getNotifiCations: getNotifiCations,
    countNotifiUnread: countNotifiUnread,
    readMore: readMore,
    markAllRead: markAllRead,
}