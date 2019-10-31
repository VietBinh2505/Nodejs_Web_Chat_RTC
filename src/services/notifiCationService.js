import notificationMD from "./../models/NotificationModels";
import UserMD from "./../models/UserModels"
let getNotifiCations = (UserIdCRR, limit = 10) => { // kiểm tra max 10 bản ghi
    return new Promise(async(resolve, reject) => {
        try {
            let notifications = await notificationMD.model.getByUserIdAndLimit(UserIdCRR, limit); // lấy ra toàn bộ collection trong database notify
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
module.exports = {
    getNotifiCations: getNotifiCations,
    countNotifiUnread: countNotifiUnread,
}