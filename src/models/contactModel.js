import mongoose from "mongoose";
let Schema = mongoose.Schema;

let ContactSchema = new Schema({
	userId: String,
	contactId: String,
	status: { type: Boolean, default: false },
	createdAt: { type: Number, default: Date.now },
	updatedAt: { type: Number, default: Date.now },
	deletedAt: { type: Number, default: null }
});

ContactSchema.statics = {
	createNew(item) {
		return this.create(item); // return Promise so onece will use async/await
	},
	
	findAllByUser(userId) {
		return this.find({
			$or: [{ userId: userId }, { contactId: userId }]
		}).exec();
	},
	checkExists(userId, contactId) {
		return this.findOne({
			$or: [
				{ $and: [{ userId: userId }, { contactId: contactId }] },
				{ $and: [{ userId: contactId }, { contactId: userId }] }
			]
		}).exec();
	},

	removeRequestContactSent(userId, contactId) {
		return this.remove({
			$and: [{ userId: userId }, { contactId: contactId }, { status: false }]
		}).exec();
	},

	removeRequestContactReceived(userId, contactId) {
		return this.remove({
			$and: [{ userId: contactId }, { contactId: userId }, { status: false }]
		}).exec();
	},

	approveRequestContactReceived(userId, contactId) {
		return this.update(
			{
				$and: [{ userId: contactId }, { contactId: userId }, { status: false }]
			},
			{ "status": true, updatedAt: Date.now() }
		).exec();
	},

	/**
	 * get contacts by userId and limit
	 * @param {String} userId
	 * @param {Numbar} limit
	 */
	getContacts(userId, limit) {
		return this.find({
			$and: [
				{
					$or: [{ userId: userId }, { contactId: userId }]
				},
				{ status: true }
			]
		})
			.sort({ updatedAt: -1 })
			.limit(limit)
			.exec();
	},
	getFriends(userId) {
		return this.find({
			$and: [
				{
					$or: [{ userId: userId }, { contactId: userId }]
				},
				{ status: true }
			]
		})
			.sort({ updatedAt: -1 })
			.exec();
	},

	/**
	 * get contacts Send by userId and limit
	 * I send add friend to something user
	 * @param {String} userId
	 * @param {Numbar} limit
	 */
	getContactsSend(userId, limit) {
		return this.find({
			$and: [{ userId: userId }, { status: false }]
		})
			.sort({ createdAt: -1 })
			.limit(limit)
			.exec();
	},

	/**
	 * get contacts Received by userId and limit
	 * Something send add friend to me
	 * @param {String} userId
	 * @param {Numbar} limit
	 */

	getContactsReceived(userId, limit) {
		return this.find({
			$and: [{ contactId: userId }, { status: false }]
		})
			.sort({ createdAt: -1 })
			.limit(limit)
			.exec();
	},

	countAllContacts(userId) {
		return this.countDocuments({
			$and: [
				{
					$or: [{ userId: userId }, { contactId: userId }]
				},
				{ status: true }
			]
		}).exec();
	},

	countAllContactsSend(userId) {
		return this.countDocuments({
			$and: [{ userId: userId }, { status: false }]
		}).exec();
	},

	countAllContactsReceived(userId) {
		return this.countDocuments({
			$and: [{ contactId: userId }, { status: false }]
		}).exec();
	},
	readMoreContacts(userId, skip, limit) {
		return this.find({
			$and: [
				{ $or: [{ userId: userId }, { contactId: userId }] },
				{ status: true }
			]
		})
			.sort({ updatedAt: -1 })
			.limit(limit)
			.skip(skip)
			.exec();
	},
	readMoreContactsSend(userId, skip, limit) {
		return this.find({
			$and: [{ userId: userId }, { status: false }]
		})
			.sort({ createdAt: -1 })
			.limit(limit)
			.skip(skip)
			.exec();
	},

	readMoreContactsReceived(userId, skip, limit) {
		return this.find({
			$and: [{ contactId: userId }, { status: false }]
		})
			.sort({ createdAt: -1 })
			.limit(limit)
			.skip(skip)
			.exec();
	},
	removeContact(userId, contactId) {
		return this.remove({
			$or: [
				{ $and: [{ userId: userId }, { contactId: contactId }, {status: true}] },
				{ $and: [{ userId: contactId }, { contactId: userId }, {status: true}] },
			],
		}).exec();
	},
	updateHasNewMessage(userId, contactId){ //id người gửi va người nhận
		return this.update({
			$or: [
				{ $and: [{ userId: userId }, { contactId: contactId }] },
				{ $and: [{ userId: contactId }, { contactId: userId }] },
			]
		}, {"updatedAt": Date.now(),}
		).exec();
	},
};

module.exports = mongoose.model("contact", ContactSchema);
