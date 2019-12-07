import database from "./../config/database";
import ContacModel from "./../models/contactModel";
import UserModel from "./../models/userModel";
import chatGroupModel from "./../models/chatGroupModel";
import MessageModel from "./../models/messageModel";
import { transErrors } from "./../../lang/vi";
import _ from "lodash";
import fs_extra from "fs-extra";

let readMore = (currentUserId, skipMessage, targetId, chatInGroup) => {
	return new Promise(async (resolve, reject) => {
		try { 
			if(chatInGroup){ //nếu trò chuyện nhóm
				let getMessage = await MessageModel.model.readMoreMessageInGroup(targetId, skipMessage, database.LimitMess);
				getMessage = _.reverse(getMessage);
				return resolve(getMessage);
			}
			// trò chuyện cá nhân
			let getMessage = await MessageModel.model.readMoreMessageInPersonal(currentUserId, targetId, skipMessage, database.LimitMess);
			//console.log(getMessage);
			getMessage = _.reverse(getMessage);
			return resolve(getMessage);
		} catch (error) {
			reject(error);
		}
	});
};
let readMoreAllChat = (currentUserId, skipPersonal, skipGroup) => {
	return new Promise(async (resolve, reject) => {
		try { 
			let contacts = await ContacModel.readMoreContacts(currentUserId, skipPersonal, database.LimitConverTaken); //lấy ra LimitConverTaken (=10) bảng bạn bè đã kp đã sắp xếp
			let usersConversationPromise = contacts.map(async (contact) => {
				if (contact.contactId == currentUserId) {
					let getUserContact = await UserModel.getNormalUserById(contact.userId); //lấy được toàn bộ info của user là bạn bè
					getUserContact.updatedAt = contact.updatedAt; //thêm đối tượng updatedAt để xắp xếp khi hiện lên giữa user và group
					return getUserContact;
				}
				let getUserContact = await UserModel.getNormalUserById(contact.contactId);
				getUserContact.updatedAt = contact.updatedAt; //thêm đối tượng updatedAt để xắp xếp khi hiện lên giữa user và group
				return getUserContact;
				
			});
			let userConversations = await Promise.all(usersConversationPromise); //lấy user trò chuyện cá nhân
			let grConversations = await chatGroupModel.readMoreChatGroup(currentUserId, skipGroup, database.LimitConverTaken); //lấy user trò chuyện nhóm
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
					let getMessages = await MessageModel.model.getMessagesInPersonal(currentUserId, Conversation._id, database.LimitMess); //lấy ra toàn bộ thông tin bảng messagemd, dạng mảng
					Conversation.message = _.reverse(getMessages); //thêm đối tượng message có giá trị là thông tin bảng messagemd
				}
				return Conversation; //trả về toàn bộ thông tin trong messagemodel có cả tin nhắn
			});

			let allConversationWithMess = await Promise.all(allConversationWithMessPromise); //lấy ra thông tin dạy JSON
			allConversationWithMess = _.sortBy(allConversationWithMess, (item) => {
				return -item.updatedAt; //sắp xếp tin nhắn theo thứ tự từ sớm nhất đến muộn nhất
			});
			resolve(allConversationWithMess);
		} catch (error) {
			reject(error);
		}
	});
};
let getAllConversationItems = (IdCrr) => {
	return new Promise(async (resolve, reject) => {
		try {
			let contacts = await ContacModel.getContacts(IdCrr, database.LimitConverTaken); //lấy ra LimitConverTaken (=10) bảng bạn bè đã kp đã sắp xếp
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
			let grConversations = await chatGroupModel.getChatGrs(IdCrr, database.LimitConverTaken); //lấy user trò chuyện nhóm
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
			reject(false);
		}
	});
};
let addNewTextEmoji = (sender, receiverId, messageVal, isChatGroup) => {
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
						avatar: database.general_avatar_group_chat, //avatar người nhận
					};
					let newMessageItem = {
						senderId: sender.id, //id người gửi
						receiverId: receiver.id, //id người nhận
						conversationType: MessageModel.conversationTypes.GROUP, //lưu kiểu trò chuyện( nhóm hay cá nhân)
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
						conversationType: MessageModel.conversationTypes.PERSONAL, //lưu kiểu trò chuyện( nhóm hay cá nhân)
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
				}
				else {
					let receiver = {
						id: getChatGroupReceiver._id, //id người nhận
						name: getChatGroupReceiver.name, //tên người nhận
						avatar: database.general_avatar_group_chat, //avatar người nhận
					};
					let imageBuffer = await fs_extra.readFile(messageVal.path);
					let imageContentType = messageVal.mimetype;
					let imageName = messageVal.originalname;
					let newMessageItem = {
						senderId: sender.id, //id người gửi
						receiverId: receiver.id, //id người nhận
						conversationType: MessageModel.conversationTypes.GROUP, //lưu kiểu trò chuyện( nhóm hay cá nhân)
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
				let getUserReceiver = await UserModel.getNormalUserById(receiverId);
				if (!getUserReceiver) {
					return reject(transErrors.conversation_not_found);
				}
				else {
					let receiver = {
						id: getUserReceiver._id, //id người nhận
						name: getUserReceiver.username, //tên người nhận
						avatar: getUserReceiver.avatar, //avatar người nhận
					};
					let imageBuffer = await fs_extra.readFile(messageVal.path);
					let imageContentType = messageVal.mimetype;
					let imageName = messageVal.originalname;

					let newMessageItem = {
						senderId: sender.id, //id người gửi
						receiverId: receiver.id, //id người nhận
						conversationType: MessageModel.conversationTypes.PERSONAL, //lưu kiểu trò chuyện( nhóm hay cá nhân)
						messageType: MessageModel.messageTypes.IMGAGE,
						sender: sender,
						receiver: receiver,
						file: { data: imageBuffer, contentType: imageContentType, fileName: imageName },
						createdAt: Date.now(),
					};
					let newMessage = await MessageModel.model.createNew(newMessageItem); //gọi đến MessageModel tạo bản ghi message
					await ContacModel.updateHasNewMessage(sender.id, getUserReceiver._id);//truyền qua id người gửi và người nhận
					resolve(newMessage); //trả về cho user tin nhắn mới tạo
				}
			}
		} catch (error) {
			reject(error);
		}
	});
};
let addNewAttachment = (sender, receiverId, messageVal, isChatGroup) => {
	return new Promise(async (resolve, reject) => {
		try {
			if (isChatGroup) { //nếu là chat group
				let getChatGroupReceiver = await chatGroupModel.getChatGroupById(receiverId);
				if (!getChatGroupReceiver) {
					return reject(transErrors.conversation_not_found);
				}
				else {
					let receiver = {
						id: getChatGroupReceiver._id, //id người nhận
						name: getChatGroupReceiver.name, //tên người nhận
						avatar: database.general_avatar_group_chat, //avatar người nhận
					};
					let attachmentBuffer = await fs_extra.readFile(messageVal.path);
					let attachmentContentType = messageVal.mimetype;
					let attachmentName = messageVal.originalname;
					let newMessageItem = {
						senderId: sender.id, //id người gửi
						receiverId: receiver.id, //id người nhận
						conversationType: MessageModel.conversationTypes.GROUP, //lưu kiểu trò chuyện( nhóm hay cá nhân)
						messageType: MessageModel.messageTypes.FILE,
						sender: sender,
						receiver: receiver,
						file: { data: attachmentBuffer, contentType: attachmentContentType, fileName: attachmentName },
						createdAt: Date.now(),
					};
					let newMessage = await MessageModel.model.createNew(newMessageItem); //gọi đến MessageModel tạo bản ghi message
					await chatGroupModel.updateHasNewMessage(getChatGroupReceiver._id, getChatGroupReceiver.messagesAmount + 1);//tổng số tin nhắn + 1
					resolve(newMessage); //trả về cho user tin nhắn mới tạo
				}
			} else {//nếu là chat đơn
				let getUserReceiver = await UserModel.getNormalUserById(receiverId);
				if (!getUserReceiver) {
					return reject(transErrors.conversation_not_found);
				}

				let receiver = {
					id: getUserReceiver._id, //id người nhận
					name: getUserReceiver.username, //tên người nhận
					avatar: getUserReceiver.avatar, //avatar người nhận
				};
				let attachmentBuffer = await fs_extra.readFile(messageVal.path);
				let attachmentContentType = messageVal.mimetype;
				let attachmentName = messageVal.originalname;

				let newMessageItem = {
					senderId: sender.id, //id người gửi
					receiverId: receiver.id, //id người nhận
					conversationType: MessageModel.conversationTypes.PERSONAL, //lưu kiểu trò chuyện( nhóm hay cá nhân)
					messageType: MessageModel.messageTypes.FILE,
					sender: sender,
					receiver: receiver,
					file: { data: attachmentBuffer, contentType: attachmentContentType, fileName: attachmentName },
					createdAt: Date.now(),
				};
				let newMessage = await MessageModel.model.createNew(newMessageItem); //gọi đến MessageModel tạo bản ghi message
				await ContacModel.updateHasNewMessage(sender.id, getUserReceiver._id);//truyền qua id người gửi và người nhận
				resolve(newMessage); //trả về cho user tin nhắn mới tạo

			}
		} catch (error) {
			reject(error);
		}
	});
};
module.exports = {
	getAllConversationItems,
	addNewTextEmoji,
	addNewImage,
	addNewAttachment,
	readMoreAllChat,
	readMore,
};