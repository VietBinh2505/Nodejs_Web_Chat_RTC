import database from "./../config/database";
import ContacModel from "./../models/contactModel";
import UserModel from "./../models/userModel";
import chatGroupModel from "./../models/chatGroupModel";
import _ from "lodash";
let getAllConversationItems = (IdCrr) =>{
    return new Promise(async(resolve, reject) =>{
        try {
            let contacts = await ContacModel.getContacts(IdCrr, database.LimitTaken); // lấy ra LimitTaken (=10) bảng bạn bè đã kp đã sắp xếp
			let usersContactPromise = contacts.map(async (contact) => {
				if (contact.contactId == IdCrr) {
                    let getUserContact =  await UserModel.getNormalUserById(contact.userId); // lấy được toàn bộ info của user là bạn bè
                    getUserContact.createdAt = contact.createdAt; // thêm đối tượng createdAt để xắp xếp khi hiện lên giữa user và group
                    return getUserContact;
				}
                else{
                    let getUserContact =  await UserModel.getNormalUserById(contact.contactId);
                    getUserContact.createdAt = contact.createdAt; // thêm đối tượng createdAt để xắp xếp khi hiện lên giữa user và group
                    return getUserContact;
                }
			});
            let userConversations = await Promise.all(usersContactPromise); //lấy user trò chuyện cá nhân
            let grConversations = await chatGroupModel.getChatGrs(IdCrr, database.LimitTaken); //lấy user trò chuyện nhóm
            let allConversations = userConversations.concat(grConversations); // lấy tất cả cuộc trò chuyện = cách trộn 2 mảng user với nhau
            allConversations = _.sortBy(allConversations, (item)=>{
                return -item.createdAt; // để dấu trừ là sắp xếp theo nhỏ tới lớn, ngược lại là dấu cộng
            });
            resolve({
                userConversations: userConversations, // truyền về views danh sách user trò chuyện cá nhân
                grConversations: grConversations, //user trò chuyện nhóm
                allConversations: allConversations, //tất cả user đã kết bạn
            });
        } catch (error) {
            console.log(error);
            console.log("loi tai getAllConversationItems / messageservice");
            reject(false);
        }
    });
};
module.exports = {
    getAllConversationItems: getAllConversationItems,
};