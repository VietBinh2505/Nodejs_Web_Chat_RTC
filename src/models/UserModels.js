import mongoose from "mongoose";
import bcrypt from "bcrypt";
let Schema = mongoose.Schema;
let UserSchema = new Schema({
    username: String,
    gender: { type: String, default: "male" },
    phone: { type: String, default: "0123456789" },
    address: { type: String, default: null },
    avatar: { type: String, default: "avatar-default.jpg" },
    role: { type: String, default: "user" },
    local: {
        email: { type: String, trim: true },
        isactive: { type: Boolean, default: false },
        password: String,
        verifytoken: String
    },
    facebook: {
        uid: String,
        token: String,
        email: { type: String, trim: true }
    },
    google: {
        uid: String,
        token: String,
        email: { type: String, trim: true }
    },
    createdAT: { type: Number, default: Date.now },
    updateAT: { type: Number, default: null },
    deletedAT: { type: Number, default: null },
});
UserSchema.statics = { // statics chỉ giúp ta tìm kiếm
    createNew(item) {
        return this.create(item); // this = ContactSchema = mongoose.Schema
    },
    findbyEmail(email) {
        return this.findOne({ "local.email": email }).exec(); // tìm xem email đã có chưa
    },
    removeById(id) {
        return this.findByIdAndRemove(id).exec();
    },
    findByToken(token) {
        return this.findOne({ "local.verifytoken": token }).exec();
    },
    verify(token) {
        return this.findOneAndUpdate({ "local.verifytoken": token }, // tìm token trong csdl
            { "local.isactive": false, "local.verifytoken": null }, //update lại các giá trị
        ).exec();
    },
    findbyFbUId(uid) {
        return this.findOne({ "facebook.uid": uid }).exec(); // tìm xem id đã có chưa
    },
    findbyggUId(uid) {
        return this.findOne({ "google.uid": uid }).exec(); // tìm xem id đã có chưa
    },
    updateUser_md(id, UpDateInfoNew) {
        return this.findByIdAndUpdate(id, UpDateInfoNew).exec(); //tìm và update theo id trong database; nhưng sẽ trả về dữ liệu user cũ
    },
    findUserbyId(id) {
        return this.findById(id).exec();
    },
    UpdatePassword(id, HashedPass) {
        return this.findByIdAndUpdate(id, { "local.password": HashedPass }).exec(); //tìm và update theo id trong database; nhưng sẽ trả về dữ liệu password đã mã hóa
    },
    findAllForAddContact(deprecatedUserIds, KeyWord) {
        return this.find({
            $and: [
                { "_id": { $nin: deprecatedUserIds } }, // lọc ra các id ko nằm trong mảng 
                { "local.isactive": false }, // điều kiện là các tài khoản đã active
                {
                    $or: [
                        { "username": { "$regex": new RegExp(KeyWord, "i") } }, // tìm các username gần giống hoặc giống với keyword
                        { "local.email": { "$regex": new RegExp(KeyWord, "i") } }, // tìm các username gần giống hoặc giống với keyword
                        { "facebook.email": { "$regex": new RegExp(KeyWord, "i") } }, // tìm các username gần giống hoặc giống với keyword
                        { "google.email": { "$regex": new RegExp(KeyWord, "i") } }, // tìm các username gần giống hoặc giống với keyword
                    ],
                },
            ],
        }, { _id: 1, username: 1, address: 1, avatar: 1 }).exec();
    },
};
UserSchema.methods = { //3 tìm ra bản ghi rồi thì gọi đến phương thức xử tại đâu
    comparePassword(password) { // mã hóa mật khẩu
        return bcrypt.compare(password, this.local.password); //1 trả về true ( so sánh với password đúng) == false(so sánh với password sai);
    },
};

module.exports = mongoose.model("user", UserSchema);