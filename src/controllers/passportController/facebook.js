import passport from 'passport';
import passportFacebook from 'passport-facebook';
import UserModel from './../../models/userModel';
import { transErrors, transSuccess } from './../../../lang/vi';
import database from "./../../config/database";
import chatGrModel from './../../models/chatGroupModel';
let FacebookStrategy = passportFacebook.Strategy;
let fbAppId = database.fbid
let fbAppSecret = database.fbsecret
let fbCallbackUrl = database.fbUrl

let initPassportFacebook = () => {
	passport.use(new FacebookStrategy({
		clientID: fbAppId,
		clientSecret: fbAppSecret,
		callbackURL: fbCallbackUrl,
		passReqToCallback: true,
		profileFields: ['email', 'gender', 'displayName'] // The field Which I want to take on fb
	}, async (req, accessToken, refreshToken, profile, done) => {
		try {
			let user = await UserModel.findUserByFacebookUid(profile.id);
			if (user) {
				return done(null, user, req.flash('success', transSuccess.loginSuccess(user.username)));
			}

			let newUserItem = {
				username: profile.displayName,
				gender: profile.gender,
				local: { isActive: true },
				facebook: {
					uid: profile.id,
					token: accessToken,
					email: `${profile.provider}@gmail.com`
				}
			};

			let newUser = await UserModel.createNew(newUserItem);
			return done(null, newUser, req.flash('success', transSuccess.loginSuccess(newUser.username)));
		} catch (error) {
			console.log(error);
			return done(null, false, req.flash('errors', transErrors.server_error));
		}
	}));

	// save userId to session 
	passport.serializeUser((user, done) => {
		done(null, user._id);
	});

	// this is called by passport.session();
	// return userInfo and assign  req.user
	// recieved id form serializeUser
	passport.deserializeUser(async (id, done) => {
		try {
			let user = await UserModel.findUserByIdForSessionToUse(id);
			let getchatGrIds = await chatGrModel.getchatGrIdsByUser(user._id); //Lấy id gr chat cửa user nếu có
			user = user.toObject();
			user.chatGrIds = getchatGrIds;
			return done(null, user);
		} catch (error) {
			console.log("có lỗi tại fb/passportlocal");
			return done(error, null);
		}
	});
}

module.exports = initPassportFacebook;