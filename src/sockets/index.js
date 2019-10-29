import addNewContact from "./contact/addNewContact";
import removeReqContact from "./contact/removeReqContact";
let initsSockets = (io) => { // io nhận từ server
    addNewContact(io);
    removeReqContact(io);
};

module.exports = initsSockets;