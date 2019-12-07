import passport from 'passport';
import googlePassport from 'passport-google-oauth';
import UserModel from './../../models/userModel';
import { transErrors, transSuccess } from './../../../lang/vi';
import database from "./../../config/database";
import chatGrModel from './../../models/chatGroupModel';
let GoogleStrategy = googlePassport.OAuth2Strategy;
let ggAppId = database.ggAppId;
let ggAppSecret = database.ggAppSecret;
let ggCallbackUrl = database.ggCallbackUrl;

let initPassportGoogle = () => {
	passport.use(new GoogleStrategy({
		clientID: ggAppId,
		clientSecret: ggAppSecret,
		callbackURL: ggCallbackUrl,
		passReqToCallback: true,
		profileFields: ['email', 'gender', 'displayName']
	}, async (req, accessToken, refreshToken, profile, done) => {
		try {

			let user = await UserModel.findUserByGoogleUid(profile.id);
			if (user) {
				return done(null, user, req.flash('success', transSuccess.loginSuccess(user.username)));
			}
			let newUserItem = {
				username: profile.emails[0].value.split('@')[0],
				gender: profile.gender,
				local: { isActive: true },
				google: {
					uid: profile.id,
					token: accessToken,
					email: profile.emails[0].value
				}
			};

			let newUser = await UserModel.createNew(newUserItem);
			return done(null, newUser, req.flash('success', transSuccess.loginSuccess(newUser.username)));

		} catch (error) {

			console.log(error);
			return done(null, false, req.flash('errors', transErrors.server_error));
		};
	}));

	passport.serializeUser((user, done) => {
		done(null, user._id);
	});

	passport.deserializeUser(async (id, done) => {
		try {
			let user = await UserModel.findUserByIdForSessionToUse(id);
			let getchatGrIds = await chatGrModel.getchatGrIdsByUser(user._id); //Lấy id gr chat cửa user nếu có
			user = user.toObject();
			user.chatGrIds = getchatGrIds;
			return done(null, user);
		} catch (error) {
			console.log("có lỗi tại local/passportlocal");
			return done(error, null);
		}
	});
};

module.exports = initPassportGoogle;