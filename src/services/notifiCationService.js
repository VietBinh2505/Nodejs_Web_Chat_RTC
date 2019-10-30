import notificationMD from "./../models/NotificationModels";
import UserMD from "./../models/UserModels"
let getNotifiCations = (UserIdCRR, limit = 10) => {
    return new Promise(async(resolve, reject) => {
        try {
            let notifications = await notificationMD.model.getByUserIdAndLimit(UserIdCRR, limit);
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
module.exports = {
    getNotifiCations: getNotifiCations,
}