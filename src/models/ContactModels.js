import mongoose from "mongoose";
import isatty from 'tty';

let Schema = mongoose.Schema;
let ContactSchema = new Schema({
    userid: String,
    contactid: String,
    status: { type: Boolean, default: false },
    createdAT: { type: Number, default: Date.now },
    updateAT: { type: Number, default: null },
    defaultAT: { type: Number, default: null },
});
ContactSchema.statics = {
    createNew(item) {
        return this.create(item); // this = ContactSchema = mongoose.Schema
    }
};
module.exports = mongoose.model("contact", ContactSchema);