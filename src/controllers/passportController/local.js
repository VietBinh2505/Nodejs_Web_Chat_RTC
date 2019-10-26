 import passport from "passport";
 import passportlocal from "passport-local";
 import usermodel from "./../../models/UserModels";
 import { tranERR, tranSuccess } from "./../../../lang/vi";
 let localStrategy = passportlocal.Strategy;

 let initpassportLocal = () => { // khởi tạo passport xác thực với tài khoản local
     //xác thực email và mk 
     passport.use(new localStrategy({
         usernameField: "email", //Lấy email từ form đăng nhập trong name=""
         passwordField: "password", //Lấy pass từ form đăng nhập trong name=""
         passReqToCallback: true, //sau khi passport xác thực xong thì gửi req tới func dòng 12
     }, async(req, email, password, done) => {
         try {
             // xác thực tính hợp lệ của email user
             let user = await usermodel.findbyEmail(email); // lấy ra người dùng có email = email truyền vào
             if (!user) { // nếu chưa có người dùng có email này thi: ...
                 return done(null, false, req.flash("errors", tranERR.err_loginfail)); // nếu chưa có người dùng thì thông báo cho người dùng
             }
             if (user.local.isactive) { // nếu có email rồi nhưng chưa active thì: ...
                 return done(null, false, req.flash("errors", tranERR.err_acc_notactive)); // nếu chưa có người dùng thì thông báo cho người dùng
             }
             // tới đây đã có email, xác thực tính hợp lệ của password
             let checkPassword = await user.comparePassword(password); // lấy được true or false
             if (!checkPassword) { // false
                 return done(null, false, req.flash("errors", tranERR.err_loginfail)); // nếu chưa có người dùng thì thông báo cho người dùng
             }
             // tới đây đã xác thực được email và mk đúng
             return done(null, user, req.flash("success", tranSuccess.login_succsess(user.username))); //nếu email và mk đúng thì báo cho người dùng đăng nhập thành công
         } catch (error) { //nếu có lỗi thì là lỗi code
             return done(null, false, req.flash("errors", tranERR.err_server));
         }
     }));
     // lưu thông tin vào session
     passport.serializeUser((user, done) => { // ghi thông của user(dòng 28) vào session
         done(null, user._id); // lưu mỗi id của user
     });
     passport.deserializeUser((id, done) => { // passport.session sẽ lấy thông tin đã lưu của user, 
         //deserializeUser sẽ lưu toàn bộ thông tin vào biến tên là req. user 
         usermodel.findUserbyId(id)
             .then(user => { // sau khi tìm thấy
                 return done(null, user);
             })
             .catch(error => {
                 return done(error, null);
             })
     });
 };
 module.exports = initpassportLocal;