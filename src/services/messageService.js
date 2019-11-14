import database from "./../config/database";
import ContacModel from "./../models/contactModel";
import UserModel from "./../models/userModel";
import chatGroupModel from "./../models/chatGroupModel";
import MessageModel from "./../models/messageModel";
import _ from "lodash";
let getAllConversationItems = (IdCrr) =>{
    return new Promise(async(resolve, reject) =>{
        try {
            let contacts = await ContacModel.getContacts(IdCrr, database.LimitTaken); //lấy ra LimitTaken (=10) bảng bạn bè đã kp đã sắp xếp
			let usersContactPromise = contacts.map(async (contact) => {
				if (contact.contactId == IdCrr) {
                    let getUserContact =  await UserModel.getNormalUserById(contact.userId); //lấy được toàn bộ info của user là bạn bè
                    getUserContact.updatedAt = contact.updatedAt; //thêm đối tượng updatedAt để xắp xếp khi hiện lên giữa user và group
                    return getUserContact;
				}
                else{
                    let getUserContact =  await UserModel.getNormalUserById(contact.contactId);
                    getUserContact.updatedAt = contact.updatedAt; //thêm đối tượng updatedAt để xắp xếp khi hiện lên giữa user và group
                    return getUserContact;
                }
			});
            let userConversations = await Promise.all(usersContactPromise); //lấy user trò chuyện cá nhân
            let grConversations = await chatGroupModel.getChatGrs(IdCrr, database.LimitTaken); //lấy user trò chuyện nhóm
            let allConversations = userConversations.concat(grConversations); //lấy tất cả cuộc trò chuyện = cách trộn 2 mảng user với nhau
            allConversations = _.sortBy(allConversations, (item)=>{
                return -item.updatedAt; //để dấu trừ là sắp xếp theo nhỏ tới lớn, ngược lại là dấu cộng
            });

            /*lấy tin nhắn để truyền ra view, màn hình chát */
            let allConversationWithMessPromise = allConversations.map(async (Conversation)=>{ //toàn bộ thông tin trong messagemodel có cả tin nhắn dạng promise
                let getMessages = await MessageModel.model.getMessages(IdCrr, Conversation._id, database.LimitMess); //lấy ra toàn bộ thông tin bảng messagemd, dạng mảng
                Conversation = Conversation.toObject(); //đổi từ mảng qua đối tượng
                Conversation.message = getMessages; //thêm đối tượng message có giá trị là thông tin bảng messagemd
                return Conversation; //trả về toàn bộ thông tin trong messagemodel có cả tin nhắn
            });

            let allConversationWithMess = await Promise.all(allConversationWithMessPromise); //lấy ra thông tin dạy JSON
            allConversationWithMess = _.sortBy(allConversationWithMess, (item)=>{
                return -item.updatedAt; // sắp xếp tin nhắn theo thứ tự từ sớm nhất đến muộn nhất
            });
            resolve({
                userConversations: userConversations, //truyền về views danh sách user trò chuyện cá nhân
                grConversations: grConversations, //user trò chuyện nhóm
                allConversations: allConversations, //tất cả user đã kết bạn
                allConversationWithMess: allConversationWithMess, //tin nhắn
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