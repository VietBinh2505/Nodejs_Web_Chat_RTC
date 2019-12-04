import ContacModel from './../models/contactModel';
import UserModel from './../models/userModel';
import NotificationModel from './../models/notificationModel';
import database from "./../config/database"
import _ from 'lodash';

let removeContact = (IdCRR, contactId) =>{
	return new Promise(async (resolve, reject) => {
		let removeContact = await ContacModel.removeContact(IdCRR, contactId);
		if (removeContact.n === 0) {
			return reject(false);
		};
		resolve(true);
	});
};


let findUsersContact = (currentUserId, keyword) => {
	return new Promise(async (resolve, reject) => {
		let deprecateUserIds = [currentUserId];
		let contactByUser = await ContacModel.findAllByUser(currentUserId);
		contactByUser.forEach(contact => {
			deprecateUserIds.push(contact.userId);
			deprecateUserIds.push(contact.contactId);
		});

		deprecateUserIds = _.uniqBy(deprecateUserIds);
		let users = await UserModel.findAllForAddContact(deprecateUserIds, keyword);
		resolve(users);
	});
};
let seachFriend = (currentUserId, keyword) => {
	return new Promise(async (resolve, reject) => {
		let friendIds = [];
		let friends = await ContacModel.getFriends(currentUserId);

		friends.forEach((item)=>{
			friendIds.push(item.userId);
			friendIds.push(item.contactId);
		});
		friendIds = _.uniqBy(friendIds);
		friendIds = friendIds.filter(userId => userId != currentUserId);
		let users = await UserModel.findAllToAddGroupChat(friendIds, keyword);
		resolve(users);
	});
};

let addNew = (currentUserId, contactId) => {
	return new Promise(async (resolve, reject) => {
		let contactExitsts = await ContacModel.checkExists(currentUserId, contactId);
		if (contactExitsts) {
			return reject(false);
		};

		// create contact
		let newContactItem = {
			userId: currentUserId,
			contactId: contactId
		};

		let newContact = await ContacModel.createNew(newContactItem);

		// create notification
		let notificationItem = {
			senderId: currentUserId,
			receiverId: contactId,
			type: NotificationModel.type.ADD_CONTACT
		};

		await NotificationModel.model.createNew(notificationItem);


		resolve(newContact);
	});
};

let removeRequestContactSent = (currentUserId, contactId) => {
	return new Promise(async (resolve, reject) => {
		let removeReq = await ContacModel.removeRequestContactSent(currentUserId, contactId);
		if (removeReq.result.n === 0) {
			return reject(false);
		};

		// remove notification
		let notifTypeAddContact = NotificationModel.type.ADD_CONTACT
		await NotificationModel.model.removeRequsetContactNotification(currentUserId, contactId, notifTypeAddContact);
		resolve(true);
	});
};

let removeRequestContactReceived = (currentUserId, contactId) => {
	return new Promise(async (resolve, reject) => {
		let removeReq = await ContacModel.removeRequestContactReceived(currentUserId, contactId);
		if (removeReq.result.n === 0) {
			return reject(false);
		};
		// // remove notification
		// let notifTypeAddContact = NotificationModel.type.ADD_CONTACT
		// await NotificationModel.model.removeRequsetContactNotification(currentUserId, contactId, notifTypeAddContact);
		// resolve(true);

		resolve(true);
	});
};

let approveRequestContactReceived = (currentUserId, contactId) => {
	return new Promise(async (resolve, reject) => {
		let approveReq = await ContacModel.approveRequestContactReceived(currentUserId, contactId);
		if (approveReq.nModified === 0) {
			return reject(false);
		};
		// create notification
		let notificationItem = {
			senderId: currentUserId,
			receiverId: contactId,
			type: NotificationModel.type.APPROVE_CONTACT
		};
		await NotificationModel.model.createNew(notificationItem);
		resolve(true);
	});
};

let getContacts = (currentUserId) => {
	return new Promise(async (resolve, reject) => {
		try {
			let contacts = await ContacModel.getContacts(currentUserId, database.LimitCT);
			let users = contacts.map(async contact => {
				if (contact.contactId == currentUserId) {
					// Something user send add friend to me
					return await UserModel.getNormalUserById(contact.userId);
				}
				// I send add friend to something user
				return await UserModel.getNormalUserById(contact.contactId);
			});

			resolve(await Promise.all(users));
		} catch (error) {
			reject(error);
		}
	});
};

let getContactsSend = (currentUserId) => {
	return new Promise(async (resolve, reject) => {
		try {
			let contacts = await ContacModel.getContactsSend(currentUserId, database.LimitCT);

			let users = contacts.map(async contact => {
				return await UserModel.getNormalUserById(contact.contactId);
			});

			resolve(await Promise.all(users));
		} catch (error) {
			reject(error);
		}
	});
};

let getContactsReceived = (currentUserId) => {
	return new Promise(async (resolve, reject) => {
		try {
			let contacts = await ContacModel.getContactsReceived(currentUserId, database.LimitCT);

			let users = contacts.map(async contact => {
				return await UserModel.getNormalUserById(contact.userId);
			});

			resolve(await Promise.all(users));
		} catch (error) {
			reject(error);
		}
	});
};

let countAllContacts = (currentUserId) => {
	return new Promise(async (resolve, reject) => {
		try {
			let count = ContacModel.countAllContacts(currentUserId);
			resolve(count);
		} catch (error) {
			reject(error);
		}
	});
};

let countAllContactsSend = (currentUserId) => {
	return new Promise(async (resolve, reject) => {
		try {
			let count = ContacModel.countAllContactsSend(currentUserId);
			resolve(count);
		} catch (error) {
			reject(error);
		}
	});
};

let countAllContactsReceived = (currentUserId) => {
	return new Promise(async (resolve, reject) => {
		try {
			let count = ContacModel.countAllContactsReceived(currentUserId);
			resolve(count);
		} catch (error) {
			reject(error);
		}
	});
};

let readMoreContacts = (currentUserId, skipNumberContacts) => {
	return new Promise(async (resolve, reject) => {
		try {
			let newContacts = await ContacModel.readMoreContacts(currentUserId, skipNumberContacts, database.LimitCT);

			let users = newContacts.map(async contact => {
				if (contact.contactId == currentUserId) {
					return await UserModel.getNormalUserById(contact.userId);
				};
				return await UserModel.getNormalUserById(contact.contactId);
			});
			resolve(await Promise.all(users));
		} catch (error) {
			reject(error);
		};
	});
};

let readMoreContactsSend = (currentUserId, skipNumberContactsSend) => {
	return new Promise(async (resolve, reject) => {
		try {
			let newContactsSend = await ContacModel.readMoreContactsSend(currentUserId, skipNumberContactsSend, database.LimitCT);
			let users = newContactsSend.map(async contact => {
				return await UserModel.getNormalUserById(contact.contactId);
			});
			resolve(await Promise.all(users));
		} catch (error) {
			reject(error);
		}
	});
};

let readMoreContactsReceived = (currentUserId, skipNumberContactsReceived) => {
	return new Promise(async (resolve, reject) => {
		try {
			let newContactsReceived = await ContacModel.readMoreContactsReceived(currentUserId, skipNumberContactsReceived, database.LimitCT);
			let users = newContactsReceived.map(async contact => {
				return await UserModel.getNormalUserById(contact.userId);
			});

			resolve(await Promise.all(users));
		} catch (error) {
			reject(error);
		}
	});
};

module.exports = {
	removeContact,
	findUsersContact,
	addNew,
	removeRequestContactSent,
	removeRequestContactReceived,
	approveRequestContactReceived,
	getContacts,
	getContactsSend,
	getContactsReceived,
	countAllContacts,
	countAllContactsSend,
	countAllContactsReceived,
	readMoreContacts,
	readMoreContactsSend,
	readMoreContactsReceived,
	seachFriend,
};
