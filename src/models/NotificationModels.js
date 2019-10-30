import mongoose from "mongoose";

let Schema = mongoose.Schema;
let NotificationSchema = new Schema({
    senderid: String,
    receiverid: String,
    type: String,
    content: String,
    isRead: { type: Boolean, default: false },
    createAT: { type: Number, default: Date.now }
});
NotificationSchema.statics = {
    createNew(item) {
        return this.create(item); // this = ContactSchema = mongoose.Schema
    },
    removeReqContactNotification(senderid, receiverid, type) {
        return this.remove({ // xóa khi trùng với 3 điều kiện sau
            $and: [
                { "senderid": senderid },
                { "receiverid": receiverid },
                { "type": type },
            ]
        }).exec();
    },
    getByUserIdAndLimit(userId, limit) {
        return this.find({ "receiverid": userId, }).sort({ "createAT": -1 }).limit(limit).exec();
    },
};
const notification_type = {
    add_Contact: "add_contact",
};
const notification_content = {
    getContent: (notificationType, isRead, userid, username, useravatar) => {
        if (!isRead) {
            if (notificationType === notification_type.add_Contact) {
                return `<span class="notif-readed-false" data-uid="${userid}"> 
                <img class="avatar-small" src="images/users/${useravatar}"alt="">
                <strong>${username}</strong> đã gửi cho bạn một lời mời kết bạn!
                </span><br><br><br>`;
            }
        }
        if (notificationType === notification_type.add_Contact) {
            return `<span data-uid="${userid}"> 
            <img class="avatar-small" src="images/users/${useravatar}"alt="">
            <strong>${username}</strong> đã gửi cho bạn một lời mời kết bạn!
            </span><br><br><br>`;
        }
        return "Không khớp với bất kỳ loại thông báo nào!";
    },
};

module.exports = {
    model: mongoose.model("notification", NotificationSchema),
    types: notification_type,
    content: notification_content,
};