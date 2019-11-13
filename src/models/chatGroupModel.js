import mongoose from 'mongoose';

let Schema = mongoose.Schema;

let ChatGroupSchema = new Schema({
	name: String,
	usersAmout: { type: Number, min: 3, max: 1999 },
	messagesAmount: { type: Number, default: 0 },
	userId: String,
	members: [
		{ userId: String }
	],
	createdAt: { type: Number, default: Date.now },
	updatedAt: { type: Number, default: Date.now },
	deletedAt: { type: Number, default: null }
});

ChatGroupSchema.statics = {
	getChatGrs(userid, limit) {
		return this.find({
			"members" : {$elemMatch: {"userId": userid}}, // elem viết tắt của element, nếu trong csdl có tồn tại "userId" = userid thì lấy hết thong tin của bảng đó
		}).sort({"updatedAt": -1}).limit(limit).exec(); // lấy bản ghi mới nhất trước tiên, và bỏ qua (limit) bản ghi
	},
};

module.exports = mongoose.model('chat-group', ChatGroupSchema);