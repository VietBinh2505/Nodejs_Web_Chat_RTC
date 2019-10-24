import passport from "passport";
import passportfb from "passport-facebook";
import usermodel from "../../models/UserModels";
import { tranERR, tranSuccess } from "../../../lang/vi";
import database from "./../../config/database";
let fbStrategy = passportfb.Strategy;
let fbid = database.fbid;
let fbsecret = database.fbsecret;
let fbUrl = database.fbUrl;
let initpassportfb = () => { // khởi tạo passport xác thực với tài khoản fb
    passport.use(new fbStrategy({
        clientID: fbid,
        clientSecret: fbsecret,
        callbackURL: fbUrl,
        profileFields: ["email", "gender", "displayName"],
        passReqToCallback: true, //sau khi passport xác thực xong thì gửi req tới func dòng 12
    }, async(req, accesstoken, refreshtoken, profile, done) => {
        try {
            // người dùng đã đăng nhập bằng fb trước đó
            let user = await usermodel.findbyFbUId(profile.id); //xem trong csdl có id chưa
            if (user) {
                return done(null, user, req.flash("success", tranSuccess.login_succsess(user.username))); //nếu tồn tại id thì báo cho người dùng đăng nhập thành công
            }
            //người dùng chưa đăng nhập lần nào
            let newUserItem = {
                username: profile.displayName,
                gender: profile.gender,
                local: {
                    isactive: true,
                },
                facebook: {
                    uid: profile.id,
                    token: accesstoken,
                    email: profile.emails[0].value,
                },
            };
            let newuser = await usermodel.createNew(newUserItem);
            return done(null, newuser, req.flash("success", tranSuccess.login_succsess(newuser.username))); //nếu tồn tại id thì báo cho người dùng đăng nhập thành công
        } catch (error) { //nếu có lỗi thì là lỗi code
            return done(null, false, req.flash("errors", tranERR.err_server));
        }
    }));
    passport.serializeUser((user, done) => { // ghi thông của user(dòng 28) vào session
        done(null, user._id); // lưu mỗi id của user
    });
    passport.deserializeUser((id, done) => { //passport.session sẽ lấy thông tin đã lưu của user
        //deserializeUser sẽ lưu toàn bộ thông tin vào biến
        usermodel.findUserbyId(id)
            .then(user => { // sau khi tìm thấy
                return done(null, user);
            })
            .catch(error => {
                return done(error, null);
            })
    });
};
module.exports = initpassportfb;