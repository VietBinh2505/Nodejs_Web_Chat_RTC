import database from "./database";
import passportIO from "passport.socketio";

let configSocketIO = (io, cookieParser, sessionStore) => {
    io.use(passportIO.authorize({
        cookieParser: cookieParser,
        key: database.key,
        secret: database.secret,
        store: sessionStore,
        success: (data, accept) => {
            if (!data.user.logged_in) { // khi user chưa đăng nhập
                return accept("Không tồn tại user!", false); // tham số đầu là string lỗi, 
            }
            return accept(null, true); //không có lỗi
        },
        fail: (data, mess, error, accept) => {
            if (error) {
                console.log("Không thể kết nối tới socketIO:", mess);
                return accept(new Error(mess), false);
            }
        },
    }));
};
module.exports = configSocketIO;