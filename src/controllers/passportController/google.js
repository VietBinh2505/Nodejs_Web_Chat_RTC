import passport from "passport";
import passportgg from "passport-google-oauth";
import usermodel from "../../models/UserModels";
import { tranERR, tranSuccess } from "../../../lang/vi";
let ggStrategy = passportgg.OAuth2Strategy;
let ggid = "62483867871-5ojmehfbbhfe7a5lef20omg5paggnn4b.apps.googleusercontent.com";
let ggsecret = "jmgitFgYsEMv56VAvAxGRNzv";
let ggUrl = "http://localhost:2505/auth/google/callback";
let initpassportgg = () => { // khởi tạo passport xác thực với tài khoản gg
    passport.use(new ggStrategy({
        clientID: ggid,
        clientSecret: ggsecret,
        callbackURL: ggUrl,
        passReqToCallback: true, //sau khi passport xác thực xong thì gửi req tới func dòng 12
    }, async(req, accesstoken, refreshtoken, profile, done) => {
        try {
            // người dùng đã đăng nhập bằng gg trước đó
            let user = await usermodel.findbyggUId(profile.id); //xem trong csdl có id chưa
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
                google: {
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
module.exports = initpassportgg;