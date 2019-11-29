import _ from 'lodash';
import chatGroupModel from "./../models/chatGroupModel";
let addNewGroup = (currentUserId, arrayMemberIds, groupChatName) =>{
   return new Promise(async(resolve, reject)=>{
      try {
         //thêm id của người dùng hiện tại vào mảng
         arrayMemberIds.unshift({userId: `${currentUserId}`}); //unshift là thêm vào đầu tiên
         arrayMemberIds = _.uniqBy(arrayMemberIds, "userId");
         let newGroupItem = {
            name: groupChatName,
            usersAmout: arrayMemberIds.length,
            userId: `${currentUserId}`,
            members: arrayMemberIds,
         };
         let newGroup = chatGroupModel.createNew(newGroupItem);
         resolve(newGroup);
      } catch (error) {
         reject(error);
      }
   });
};

module.exports = {
   addNewGroup,
};