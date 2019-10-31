import { notify } from "./../services/index"
let gethome = async(req, res) => {
    let notifications = await notify.getNotifiCations(req.user._id);
    let countNotifiUnread = await notify.countNotifiUnread(req.user._id);
    return res.render("main/home/home", {
        errors: req.flash("errors"), //định nghĩa errors là gì rồi truyền ra views
        success: req.flash("success"), //định nghĩa success là gì rồi truyền ra views
        user: req.user,
        notifications: notifications,
        countNotifiUnread: countNotifiUnread,

    });
};
module.exports = {
    gethome: gethome,
};