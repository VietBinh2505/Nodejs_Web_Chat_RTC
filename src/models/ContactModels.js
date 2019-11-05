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
    getContacts(userid, limit) { // chức năng lấy ra danh bạ
        console.log();
        return this.find({
            $and: [{
                    $or: [
                        { "userid": userid },
                        { "contactid": userid },
                    ]
                },
                { "status": true },
            ]
        }).sort({ "createdAT": -1 }).limit(limit).exec();
    },
    GetContactsSent(userid, limit) { //lời mời kết bạn mình gửi đi
        return this.find({
            $and: [
                { "userid": userid },
                { "status": false }
            ]
        }).sort({ "createdAT": -1 }).limit(limit).exec();
    },
    GetContactsReceived(userid, limit) { // lời mời kết bạn người khác gửi cho mình
        return this.find({
            $and: [
                { "contactid": userid },
                { "status": false }
            ]
        }).sort({ "createdAT": -1 }).limit(limit).exec();
    },
    countAllContacts(userid) { // đếm danh bạ
        return this.count({
            $and: [{
                    $or: [
                        { "userid": userid },
                        { "contactid": userid },
                    ]
                },
                { "status": true },
            ]
        }).exec();
    },
    countAllContactsSent(userid) { // đếm lời mời kết bạn mình gửi đi
        return this.count({
            $and: [
                { "userid": userid },
                { "status": false },
            ]
        }).exec();
    },
    countAllContactsReceived(userid) { // đếm lời mời kết bạn người khác gửi cho mình
        return this.count({
            $and: [{
                    $or: [
                        { "userid": userid },
                        { "contactid": userid },
                    ]
                },
                { "status": false },
            ]
        }).exec();
    },
    readMoreContacts(userid, skipNumber, limit){ // chuc nang xem them danh ba
        return this.find({
            $and: [{
                    $or: [
                        { "userid": userid },
                        { "contactid": userid },
                    ]
                },
                { "status": true },
            ]
        }).sort({ "createdAT": -1 }).skip(skipNumber).limit(limit).exec();
    },
    readMoreContactsSent(userid, skipNumber, limit){ // chuc nang xem them danh ba
        return this.find({
            $and: [
                { "userid": userid },
                { "status": false }
            ]
        }).sort({ "createdAT": -1 }).skip(skipNumber).limit(limit).exec();
    },
    readMoreContactsReceided(userid, skipNumber, limit){ // chuc nang xem them danh ba
        return this.find({
            $and: [
                { "contactid": userid },
                { "status": false },
            ]
        }).sort({ "createdAT": -1 }).skip(skipNumber).limit(limit).exec();
    },
};
module.exports = mongoose.model("contact", ContactSchema);