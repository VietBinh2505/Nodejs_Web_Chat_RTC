import addNewContact from "./contact/addNewContact";
let initsSockets = (io) => { // io nhận từ server
    addNewContact(io);
};

module.exports = initsSockets;