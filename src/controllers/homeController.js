import { notification, contact, message } from './../services/index'
import database from "./../config/database";
import { bufferToBase64, lastItemArray, convertTimestampToHumanTime } from "./../helper/clientsHelper"
import request from "request";
let getICETurnServer = () => {
	return new Promise(async (resolve, reject) => {
		let o = {
			format: "urls"
		};
		let bodyString = JSON.stringify(o);
		let options = {
			url: "https://global.xirsys.net/_turn/WebChat",
			// host: "global.xirsys.net",
			// path: "/_turn/WebChat",
			method: "PUT",
			headers: {
				"Authorization": "Basic " + Buffer.from("VietBinh2505:acfb6948-0e7e-11ea-b7d8-0242ac110003").toString("base64"),
				"Content-Type": "application/json",
				"Content-Length": bodyString.length
			},
			
		};
		request(options, function(error, response, body){
			if (error) {
				console.log("Lỗi ở getICETurnServer/homeCTL"+ error);
			  	return reject(error);
			} 
			let bodyJson = JSON.parse(body);
			resolve(bodyJson.v.iceServers);
		 });
	});
};
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
	let allConversationWithMess = getAllConversationItems.allConversationWithMess; //các tin nhắn (max 20 tin)
	let iceServerList = await getICETurnServer();
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
		LimitCT: database.LimitCT,
		LimitNT: database.LimitNT,
		allConversationWithMess, //các tin nhắn (max 20 tin)
		bufferToBase64,
		lastItemArray,
		convertTimestampToHumanTime,
		iceServerList : JSON.stringify(iceServerList),
	});
};



module.exports = {
	getHome,
};