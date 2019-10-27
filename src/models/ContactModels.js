import mongoose from "mongoose";

let Schema = mongoose.Schema;
let ContactSchema = new Schema({
    userid: String,
    contactid: String,
    status: { type: Boolean, default: false },
    createdAT: { type: Number, default: Date.now },
    updateAT: { type: Number, default: null },
    deletedAT: { type: Number, default: null },
});
ContactSchema.statics = {
    createNew(item) {
        return this.create(item); // this = ContactSchema = mongoose.Schema
    },
    findAllByUser(IdCRR) { // tìm bạn bè theo userid
        return this.find({
            $or: [
                { "userid": IdCRR },
                { "contactid": IdCRR }
            ]
        }).exec();
    },
    checkExitsts(userid, contactid) { // kiểm tra tồn tại
        return this.findOne({
            $or: [{
                    $and: [
                        { "userid": userid }, //kiểm tra userid trong csdl có trùng với uerid mình truyền vào hay không
                        { "contactid": contactid }, //kiểm tra contactid trong csdl có trùng với contactid mình truyền vào hay không
                    ]
                },
                {
                    $and: [
                        { "userid": contactid }, //kiểm tra contactid trong csdl có trùng với contactid mình truyền vào hay không
                        { "contactid": userid }, //kiểm tra userid trong csdl có trùng với userid mình truyền vào hay không
                    ]
                },
            ],
        }).exec();
    },
    removeReqContact(userid, contactid) { // khi huỷ yêu cầu kết bạn sẽ xóa bản ghi
        return this.remove({
            $and: [
                { "userid": userid }, //kiểm tra userid trong csdl có trùng với uerid mình truyền vào hay không
                { "contactid": contactid }, //kiểm tra contactid trong csdl có trùng với contactid mình truyền vào hay không
            ],
        }).exec();
    },
};
module.exports = mongoose.model("contact", ContactSchema);