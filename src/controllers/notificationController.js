import { notify } from "./../services/index"

let readMore = async(req, res) => { //xem nhiều hơn 
    try {
        let skipNumberNoti = +(req.query.skipNumber);
        // lấy thêm id
        let newNotifiCations = await notify.readMore(req.user._id, skipNumberNoti); //truyền id hiện tại,
        return res.status(200).send(newNotifiCations);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
};
let markAllRead = async(req, res) => { //xem nhiều hơn 
    try {
        let mark = notify.markAllRead(req.user._id, req.body.targetUser);
        return res.status(200).send(mark);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
};
module.exports = {
    readMore: readMore,
    markAllRead: markAllRead
};