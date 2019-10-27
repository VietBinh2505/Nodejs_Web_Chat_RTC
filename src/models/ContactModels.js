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
    }
};
module.exports = mongoose.model("contact", ContactSchema);