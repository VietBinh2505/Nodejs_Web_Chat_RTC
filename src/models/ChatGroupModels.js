import mongoose from "mongoose";

let Schema = mongoose.Schema;
let ChatGroupSchema = new Schema({
    name: String,
    userAmount: { type: Number, min: 3, max: 177 },
    messageamout: { type: Number, default: 0 },
    userId: String,
    members: [
        { userid: String }
    ],
    createdAT: { type: Number, default: Date.now },
    updateAT: { type: Number, default: null },
    defaultAT: { type: Number, default: null },
});
module.exports = mongoose.model("contact", ChatGroupSchema);