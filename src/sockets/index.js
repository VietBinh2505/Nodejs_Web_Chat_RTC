import addNewContact from "./contact/addNewContact";
import removeReqContactSent from "./contact/removeReqContactSent";
let initsSockets = (io) => { // io nhận từ server
    addNewContact(io);
    removeReqContactSent(io);
};

module.exports = initsSockets;