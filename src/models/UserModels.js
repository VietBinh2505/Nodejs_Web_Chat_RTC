import mongoose from "mongoose";
import { verify } from "crypto";

let Schema = mongoose.Schema;
let UserSchema = new Schema({
    username: String,
    gender: { type: String, default: "male" },
    phone: { type: Number, default: null },
    address: { type: String, default: null },
    avatar: { type: String, default: "avatar-default.jpg" },
    role: { type: String, default: "user" },
    local: {
        email: { type: String, trim: true },
        password: String,
        isactive: { type: Boolean, default: false },
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
UserSchema.statics = {
    createNew(item) {
        return this.create(item); // this = ContactSchema = mongoose.Schema
    },
    findbyEmail(email) {
        return this.findOne({ "local.email": email }).exec(); // tìm xem email đã có chưa
    },
    // removeById(id) {
    //     return this.findbyIdAndRemove(id).exec();
    // },
    // findByToken(token) {
    //     return this.findOne({ "local.verifytoken": email }).exec();
    // },
    // verify(token) {
    //     return this.findOneAndUpdate({ "local.verifytoken": token }, // tìm token trong csdl
    //         { "local.isactive": true, "local.verifytoken": null }, //update lại các giá trị
    //     ).exec();
    // },

};

module.exports = mongoose.model("user", UserSchema);