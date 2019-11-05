import { contact, notify } from "./../services/index";
import database from "./../config/database";
let gethome = async(req, res) => {
    // hiển thị ra thông báo
    let notifications = await notify.getNotifiCations(req.user._id); // 10 mục một lần
    let countNotifiUnread = await notify.countNotifiUnread(req.user._id); // nhận được số lượng thông báo chưa đọc
    let contacts = await contact.getContacts(req.user._id); // contact mình gửi đi
    let contactsSent = await contact.GetContactsSent(req.user._id); // contact mình gửi đi và chưa được xác nhận
    let contactsReceived = await contact.GetContactsReceived(req.user._id); // contact người khác gửi cho mình
    // đếm thông báo
    let countAllContacts = await contact.countAllContacts(req.user._id); // đếm contact mình gửi đi
    let countAllContactsSent = await contact.countAllContactsSent(req.user._id); // đếm contact mình gửi đi và chưa được xác nhận
    let countAllContactsReceived = await contact.countAllContactsReceived(req.user._id); // đếm contact người khác gửi cho mình
    return res.render("main/home/home", {
        errors: req.flash("errors"), //định nghĩa errors là gì rồi truyền ra views
        success: req.flash("success"), //định nghĩa success là gì rồi truyền ra views
        user: req.user,
        notifications: notifications,
        countNotifiUnread: countNotifiUnread,
        contacts: contacts, // lấy ra được thông tin danh bạn
        contactsSent: contactsSent,
        contactsReceived: contactsReceived,
        countAllContacts: countAllContacts,
        countAllContactsSent: countAllContactsSent,
        countAllContactsReceived: countAllContactsReceived,
        LimitCT: database.LimitCT,
        LimitNT: database.LimitNT,
    });
};
module.exports = {
    gethome: gethome,
};