import { notification, contact, message } from './../services/index'
import database from "./../config/database";
let getHome = async (req, res) => {
	//only (10 item one time)
	let notifications = await notification.getNotifications(req.user._id); //lấy được các thông báo mk chưa đọc
	let countNotifUnread = await notification.countNotifUnread(req.user._id); //đếm thông báo chưa đọc
	let contacts = await contact.getContacts(req.user._id); //lấy danh bạ
	let contactsSend = await contact.getContactsSend(req.user._id); //lấy các yêu cầu kết bạn mình gửi đi
	let contactsReceived = await contact.getContactsReceived(req.user._id); //lấy các yêu cầu kết bạn người khác gửi tới

	let countAllContacts = await contact.countAllContacts(req.user._id); //đếm danh bạ
	let countAllContactsSend = await contact.countAllContactsSend(req.user._id); //đếm lời mời kp mk gửi đi
	let countAllContactsReceived = await contact.countAllContactsReceived(req.user._id);//đếm lời mời kp người khác gửi tới
	let getAllConversationItems = await message.getAllConversationItems(req.user._id); //lấy được toàn bộ user: chat nhóm, chát riêng, tất cả
	let userConversation = getAllConversationItems.userConversations; //danh sách chát đơn
	let grConversation = getAllConversationItems.grConversations; //danh sách chát nhóm
	let allConversation = getAllConversationItems.allConversations; //danh sách chat tất cả
	return res.render('main/home/home', {
		errors: req.flash('errors'), //định nghĩa errors là gì rồi truyền ra views
		success: req.flash('success'), //định nghĩa success là gì rồi truyền ra views
		user: req.user, //gửi thông tin tài khoản đang truy cập
		notifications, //lấy được các thông báo mk chưa đọc
		countNotifUnread, //đếm thông báo chưa đọc
		contacts, //lấy danh bạ
		contactsSend, //lấy các yêu cầu kết bạn mình gửi đi
		contactsReceived, //lấy các yêu cầu kết bạn người khác gửi tới
		countAllContacts, //đếm danh bạ
		countAllContactsSend, //đếm lời mời kp mk gửi đi
		countAllContactsReceived, //đếm lời mời kp người khác gửi tới
		userConversation, //danh sách chát đơn để cho leftside dùng (file ejs)
		grConversation, //danh sách chát nhóm để cho leftside dùng (file ejs)
		allConversation, //danh sách chát all để cho leftside dùng (file ejs)
        LimitCT: database.LimitCT,
        LimitNT: database.LimitNT,
	});
};

module.exports = {
	getHome
};