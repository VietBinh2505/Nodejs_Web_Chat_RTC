import mongoose from "mongoose";

let Schema = mongoose.Schema;
let messageSchema = new Schema({
    sender: {
        id: String,
        username: String,
        avatar: String
    },
    receiver: {
        id: String,
        username: String,
        avatar: String
    },
    text: String,
    file: { data: Buffer, contentype: String, fileName: String },
    createdAT: { type: Number, default: Date.now },
    updateAT: { type: Number, default: null },
    defaultAT: { type: Number, default: null },
});
module.exports = mongoose.model("message", messageSchema);