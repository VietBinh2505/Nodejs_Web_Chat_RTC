import contactModel from "./../models/ContactModels";
import userModel from "./../models/UserModels";
import notificationMD from "./../models/NotificationModels";
import _ from "lodash";

let countAllContacts = (idCRR) => {
    return new Promise(async(resolve, reject) => { // xóa yêu cầu kp
        try {
            let count = await contactModel.countAllContacts(idCRR);
            resolve(count); // trả về số đếm
        } catch (error) {
            reject(error);
        }
    });
};
let countAllContactsSent = (idCRR) => {
    return new Promise(async(resolve, reject) => { // xóa yêu cầu kp
        try {
            let count = await contactModel.countAllContactsSent(idCRR);
            resolve(count); // trả về số đếm
        } catch (error) {
            reject(error);
        }
    });
};
let countAllContactsReceived = (idCRR) => {
    return new Promise(async(resolve, reject) => { // xóa yêu cầu kp
        try {
            let count = await contactModel.countAllContactsReceived(idCRR);
            resolve(count); // trả về số đếm
        } catch (error) {
            reject(error);
        }
    });
};
let FindUsersContact = (IdCRR, KeyWord) => { // tìm kiếm người dùng
    return new Promise(async(resolve, reject) => {
        let deprecatedUserIds = [IdCRR]; // mảng id các user ko cần dùng đến
        let contactsByUser = await contactModel.findAllByUser(IdCRR); // lấy mảng từ contact model
        contactsByUser.forEach((contact) => { // duyệt mảng các id tìm thấy
            deprecatedUserIds.push(contact.userid); // thêm user id vào mảng
            deprecatedUserIds.push(contact.contactid); // thêm contact id vào mảng
        });
        deprecatedUserIds = _.uniqBy(deprecatedUserIds); // loại bỏ các id trùng nhau trong mảng
        let users = await userModel.findAllForAddContact(deprecatedUserIds, KeyWord);
        resolve(users);
    });
};
let addNew = (IdCRR, contactid) => { // thêm người dùng
    return new Promise(async(resolve, reject) => {
        let contactExists = await contactModel.checkExitsts(IdCRR, contactid);
        if (contactExists) { // nếu tồn tại bản ghi
            return reject(false);
        }
        let newContactItem = { // tạo bản ghi trong csdl có:
            userid: IdCRR, // id truyền vào
            contactid: contactid, // id truyền vào
            // ... các trường khác đã có defaul
        };
        let newContact = await contactModel.createNew(newContactItem); //tạo ra 1 bảng thông báo cho csdl contact
        let notificationItem = { // tạo dữ liệu cho thông báo
            senderid: IdCRR, //người gửi lời mời kp (idCRR chính là mình)
            receiverid: contactid, // người nhận là contact id
            type: notificationMD.types.add_Contact, // lấy từ notifi models
        };
        await notificationMD.model.createNew(notificationItem); //tạo ra 1 bảng thông báo cho csdl notifi
        resolve(newContact);
    });
};
let removeReqContact = (IdCRR, contactid) => {
    return new Promise(async(resolve, reject) => { // xóa yêu cầu kp
        let removeReq = await contactModel.removeReqContact(IdCRR, contactid);
        if (removeReq.result.n === 0) {
            return reject(false);
        }
        await notificationMD.model.removeReqContactNotification(IdCRR, contactid, notificationMD.types.add_Contact); // xóa database lưu trữ notifi
        // xóa thông báo yêu cầu kp

        resolve(true);
    });
};
let getContacts = (IdCRR) => { // chức năng lấy ra danh bạ
    return new Promise(async(resolve, reject) => { // xóa yêu cầu kp
        try {
            let contacts = await contactModel.getContacts(IdCRR, 10);
            let users = contacts.map(async(contact) => { // gần giống foreach, map sẽ trả về 1 mảng mới gồm các userid
                if (contact.contactid == IdCRR) {
                    return await userModel.findUserbyId(contact.userid); // lấy được thông tin của người dùng (đoán vậy)
                } else {
                    return await userModel.findUserbyId(contact.contactid); // lấy được thông tin của người dùng (đoán vậy)
                }
            });
            resolve(await Promise.all(users)); // lấy toàn bộ thông tin của user
        } catch (error) {
            reject(error);
        }
    });
};
let GetContactsSent = (IdCRR) => { // lời mời kết bạn mình gửi đi
    return new Promise(async(resolve, reject) => {
        try {
            let contacts = await contactModel.GetContactsSent(IdCRR, 10);
            let users = contacts.map(async(contact) => { // gần giống foreach, map sẽ trả về 1 mảng mới gồm các userid
                return await userModel.findUserbyId(contact.contactid); // lấy được thông tin của người dùng (đoán vậy)
            });
            resolve(await Promise.all(users)); // lấy toàn bộ thông tin của user
        } catch (error) {
            reject(error);
        }
    });
};
let GetContactsReceived = (IdCRR) => {
    return new Promise(async(resolve, reject) => { // xóa yêu cầu kp
        try {
            let contacts = await contactModel.GetContactsReceived(IdCRR, 10);
            let users = contacts.map(async(contact) => { // gần giống foreach, map sẽ trả về 1 mảng mới gồm các userid
                return await userModel.findUserbyId(contact.userid); // lấy được thông tin của người dùng (đoán vậy)
            });
            resolve(await Promise.all(users)); // lấy toàn bộ thông tin của user
        } catch (error) {
            reject(error);
        }
    });
};
module.exports = {
    FindUsersContact: FindUsersContact,
    addNew: addNew,
    removeReqContact: removeReqContact,
    getContacts: getContacts,
    GetContactsSent: GetContactsSent,
    GetContactsReceived: GetContactsReceived,
    countAllContacts: countAllContacts,
    countAllContactsSent: countAllContactsSent,
    countAllContactsReceived: countAllContactsReceived,
};