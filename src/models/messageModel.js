import mongoose from 'mongoose';

let Schema = mongoose.Schema;

let MessageSchema = new Schema({
	senderId: String, // id người gửi
	receiverId: String, // id người nhận
	convetsationType: String, // lưu kiểu trò chuyện( nhóm hay cá nhân)
	messageType: String,
	sender: {
		id: String,
		name: String,
		avatar: String
	},
	receiver: {
		id: String,
		name: String,
		avatar: String
	},
	text: String,
	file: { data: Buffer, contentType: String, fileName: String },
	createdAt: { type: Number, default: Date.now },
	updatedAt: { type: Number, default: null },
	deletedAt: { type: Number, default: null }
});
MessageSchema.statics = {
	getMessagesInPersonal(senderId, receiverId, limit){ //lấy các tin nhắn trong cuộc trò chuyện đơn
		return this.find({
			$or:[
				{$and: [
					{"senderId": senderId},
					{"receiverId": receiverId},
				]},
				{$and: [
					{"senderId": receiverId},
					{"receiverId": senderId},
				]},
			],
		}).sort({"createdAt": 1}).limit(limit).exec();
	},
	getMessagesInGroup(receiverId, limit){ //lấy các tin nhắn trong cuộc trò chuyện đơn
		return this.find({"receiverId": receiverId}).sort({"createdAt": 1}).limit(limit).exec();
	},
};
const MESSAGE_CONVERSATION_TYPES = {
	PERSONAL: "personal", //trò chuyện cá nhân
	PERSONAL: "group", // trò chuyện nhóm
};
const MESSAGE_TYPE = {
	TEXT: "text",
	IMGAGE: "image",
	FILE: "file",
}
module.exports = {
	model: mongoose.model("message", MessageSchema),
	conversationTypes: MESSAGE_CONVERSATION_TYPES,
	messageTypes: MESSAGE_TYPE,
};