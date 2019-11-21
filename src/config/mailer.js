import nodeMailer from 'nodemailer';
import database from "./database"
let admail = database.MAIL_USER;
let adpassword = database.MAIL_PASSWORD;
let mailhost = database.MAIL_HOST;
let mailport = database.MAIL_PORT;

let sendMail = (to, subject, htmlContent) => {
	let transporter = nodeMailer.createTransport({
		host: mailhost,
		port: mailport,
		secure: false,
		auth: {
			user: admail,
			pass: adpassword,
		},
	});
	let options = {
		from: admail,
		to: to,
		subject: subject,
		html: htmlContent,
	}
	return transporter.sendMail(options);
};

module.exports = sendMail;