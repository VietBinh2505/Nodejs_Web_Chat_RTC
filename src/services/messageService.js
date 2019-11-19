import database from "./../config/database";
import ContacModel from "./../models/contactModel";
import UserModel from "./../models/userModel";
import chatGroupModel from "./../models/chatGroupModel";
import MessageModel from "./../models/messageModel";
import { transErrors } from "./../../lang/vi";
import { app } from "./../config/app"
import _ from "lodash";
import fs_extra from "fs-extra"
let getAllConversationItems = (IdCrr) => {
	return new Promise(async (resolve, reject) => {
		try {
			let contacts = await ContacModel.getContacts(IdCrr, database.LimitTaken); //lấy ra LimitTaken (=10) bảng bạn bè đã kp đã sắp xếp
			let usersContactPromise = contacts.map(async (contact) => {
				if (contact.contactId == IdCrr) {
					let getUserContact = await UserModel.getNormalUserById(contact.userId); //lấy được toàn bộ info của user là bạn bè
					getUserContact.updatedAt = contact.updatedAt; //thêm đối tượng updatedAt để xắp xếp khi hiện lên giữa user và group
					return getUserContact;
				}
				else {
					let getUserContact = await UserModel.getNormalUserById(contact.contactId);
					getUserContact.updatedAt = contact.updatedAt; //thêm đối tượng updatedAt để xắp xếp khi hiện lên giữa user và group
					return getUserContact;
				}
			});
			let userConversations = await Promise.all(usersContactPromise); //lấy user trò chuyện cá nhân
			let grConversations = await chatGroupModel.getChatGrs(IdCrr, database.LimitTaken); //lấy user trò chuyện nhóm
			let allConversations = userConversations.concat(grConversations); //lấy tất cả cuộc trò chuyện = cách trộn 2 mảng user với nhau
			allConversations = _.sortBy(allConversations, (item) => {
				return -item.updatedAt; //để dấu trừ là sắp xếp theo nhỏ tới lớn, ngược lại là dấu cộng
			});

			/*lấy tin nhắn để truyền ra view, màn hình chát */
			let allConversationWithMessPromise = allConversations.map(async (Conversation) => { //toàn bộ thông tin trong messagemodel có cả tin nhắn dạng promise
				Conversation = Conversation.toObject(); //đổi từ mảng qua đối tượng
				if (Conversation.members) { //nếu có members lấy dữ liệu tin nhắn trong nhóm trò chuyện
					let getMessages = await MessageModel.model.getMessagesInGroup(Conversation._id, database.LimitMess); //lấy ra toàn bộ thông tin bảng messagemd, dạng mảng
					Conversation.message = _.reverse(getMessages); //thêm đối tượng message có giá trị là thông tin bảng messagemd
				}
				else { //lấy dữ liệu tin nhắn trong trò chuyện đơn
					let getMessages = await MessageModel.model.getMessagesInPersonal(IdCrr, Conversation._id, database.LimitMess); //lấy ra toàn bộ thông tin bảng messagemd, dạng mảng
					Conversation.message = _.reverse(getMessages); //thêm đối tượng message có giá trị là thông tin bảng messagemd
				}
				return Conversation; //trả về toàn bộ thông tin trong messagemodel có cả tin nhắn
			});

			let allConversationWithMess = await Promise.all(allConversationWithMessPromise); //lấy ra thông tin dạy JSON
			allConversationWithMess = _.sortBy(allConversationWithMess, (item) => {
				return -item.updatedAt; //sắp xếp tin nhắn theo thứ tự từ sớm nhất đến muộn nhất
			});
			resolve({
				allConversationWithMess: allConversationWithMess, //tin nhắn
			});
		} catch (error) {
			console.log(error);
			console.log("loi tai getAllConversationItems / messageservice");
			reject(false);
		}
	});
};

let addNewTextEmji = (sender, receiverId, messageVal, isChatGroup) => {
	return new Promise(async (resolve, reject) => {
		try {
			if (isChatGroup) { //nếu là chat group
				let getChatGroupReceiver = await chatGroupModel.getChatGroupById(receiverId);
				if (!getChatGroupReceiver) {
					return reject(transErrors.conversation_not_found);
				} else {
					let receiver = {
						id: getChatGroupReceiver._id, //id người nhận
						name: getChatGroupReceiver.name, //tên người nhận
						avatar: app.general_avatar_group_chat, //avatar người nhận
					};
					let newMessageItem = {
						senderId: sender.id, //id người gửi
						receiverId: receiver.id, //id người nhận
						convetsationType: MessageModel.conversationTypes.GROUP, //lưu kiểu trò chuyện( nhóm hay cá nhân)
						messageType: MessageModel.messageTypes.TEXT,
						sender: sender,
						receiver: receiver,
						text: messageVal,
						createdAt: Date.now(),
					};
					let newMessage = await MessageModel.model.createNew(newMessageItem); //gọi đến MessageModel tạo bản ghi message
					await chatGroupModel.updateHasNewMessage(getChatGroupReceiver._id, getChatGroupReceiver.messagesAmount + 1);//tổng số tin nhắn + 1
					resolve(newMessage); //trả về cho user tin nhắn mới tạo
				}
			}
			else {//nếu là chat đơn
				let getuserReceiver = await UserModel.getNormalUserById(receiverId);
				if (!getuserReceiver) {
					return reject(transErrors.conversation_not_found);
				}
				else {
					let receiver = {
						id: getuserReceiver._id, //id người nhận
						name: getuserReceiver.username, //tên người nhận
						avatar: getuserReceiver.avatar, //avatar người nhận
					};
					let newMessageItem = {
						senderId: sender.id, //id người gửi
						receiverId: receiver.id, //id người nhận
						convetsationType: MessageModel.conversationTypes.PERSONAL, //lưu kiểu trò chuyện( nhóm hay cá nhân)
						messageType: MessageModel.messageTypes.TEXT,
						sender: sender,
						receiver: receiver,
						text: messageVal,
						createdAt: Date.now(),
					};
					let newMessage = await MessageModel.model.createNew(newMessageItem); //gọi đến MessageModel tạo bản ghi message
					await ContacModel.updateHasNewMessage(sender.id, receiver.id);//truyền qua id người gửi và người nhận
					resolve(newMessage); //trả về cho user tin nhắn mới tạo
				}
			}
		} catch (error) {
			console.log("loi tai addNewTextEmji/service");
			console.log(error);
			reject(error);
		}
	});
};

let addNewImage = (sender, receiverId, messageVal, isChatGroup) => {
	return new Promise(async (resolve, reject) => {
		try {
			if (isChatGroup) { //nếu là chat group
				let getChatGroupReceiver = await chatGroupModel.getChatGroupById(receiverId);
				if (!getChatGroupReceiver) {
					return reject(transErrors.conversation_not_found);
				} else {
					let receiver = {
						id: getChatGroupReceiver._id, //id người nhận
						name: getChatGroupReceiver.name, //tên người nhận
						avatar: app.general_avatar_group_chat, //avatar người nhận
					};
					let imageBuffer = await fs_extra.readFile(messageVal.path);
					let imageContentType = messageVal.mimetype;
					let imageName = messageVal.originalname;
					let newMessageItem = {
						senderId: sender.id, //id người gửi
						receiverId: receiver.id, //id người nhận
						convetsationType: MessageModel.conversationTypes.GROUP, //lưu kiểu trò chuyện( nhóm hay cá nhân)
						messageType: MessageModel.messageTypes.IMGAGE,
						sender: sender,
						receiver: receiver,
						file: { data: imageBuffer, contentType: imageContentType, fileName: imageName },
						createdAt: Date.now(),
					};
					let newMessage = await MessageModel.model.createNew(newMessageItem); //gọi đến MessageModel tạo bản ghi message
					await chatGroupModel.updateHasNewMessage(getChatGroupReceiver._id, getChatGroupReceiver.messagesAmount + 1);//tổng số tin nhắn + 1
					resolve(newMessage); //trả về cho user tin nhắn mới tạo
				}
			}
			else {//nếu là chat đơn
				let getuserReceiver = await UserModel.getNormalUserById(receiverId);
				if (!getuserReceiver) {
					return reject(transErrors.conversation_not_found);
				}
				else {
					let receiver = {
						id: getuserReceiver._id, //id người nhận
						name: getuserReceiver.username, //tên người nhận
						avatar: getuserReceiver.avatar, //avatar người nhận
					};
					let imageBuffer = await fs_extra.readFile(messageVal.path);
					let imageContentType = messageVal.mimetype;
					let imageName = messageVal.originalname;
					let newMessageItem = {
						senderId: sender.id, //id người gửi
						receiverId: receiver.id, //id người nhận
						convetsationType: MessageModel.conversationTypes.PERSONAL, //lưu kiểu trò chuyện( nhóm hay cá nhân)
						messageType: MessageModel.messageTypes.IMGAGE,
						sender: sender,
						receiver: receiver,
						file: { data: imageBuffer, contentType: imageContentType, fileName: imageName },
						createdAt: Date.now(),
					};
					let newMessage = await MessageModel.model.createNew(newMessageItem); //gọi đến MessageModel tạo bản ghi message
					await ContacModel.updateHasNewMessage(sender.id, receiver.id);//truyền qua id người gửi và người nhận
					resolve(newMessage); //trả về cho user tin nhắn mới tạo
				}
			}
		} catch (error) {
			console.log("loi tai addNewTextEmji/service");
			console.log(error);
			reject(error);
		}
	});
};
module.exports = {
	getAllConversationItems,
	addNewTextEmji,
	addNewImage,
};