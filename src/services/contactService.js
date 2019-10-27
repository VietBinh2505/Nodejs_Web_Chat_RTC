import contactModel from "./../models/ContactModels";
import userModel from "./../models/UserModels";
import _ from "lodash";
let FindUsersContact = (IdCRR, KeyWord) => {
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
let addNew = (IdCRR, contactid) => {
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
        let newContact = await contactModel.createNew(newContactItem);
        resolve(newContact);
    });
};
let removeReqContact = (IdCRR, contactid) => {
    return new Promise(async(resolve, reject) => {
        let removeReq = await contactModel.removeReqContact(IdCRR, contactid);
        if (removeReq.result.n === 0) {
            return reject(false);
        }
        resolve(true);
    });
};
module.exports = {
    FindUsersContact: FindUsersContact,
    addNew: addNew,
    removeReqContact: removeReqContact,
};