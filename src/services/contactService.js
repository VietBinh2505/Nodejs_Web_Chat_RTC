import contactModel from "./../models/ContactModels";
import userModel from "./../models/UserModels";
import _ from "lodash";
let FindUsersContact = (IdCRR, KeyWord) => {
    return new Promise(async(resolve, reject) => {
        let deprecatedUserIds = []; // mảng id các user ko cần dùng đến
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

module.exports = {
    FindUsersContact: FindUsersContact,
};