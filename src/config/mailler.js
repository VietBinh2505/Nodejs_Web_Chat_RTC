import nodemailer from "nodemailer";
import database from "./database";

let admail = database.MAIL_USER;
let adpassword = database.MAIL_PASSWORD;
let mailhost = database.MAIL_HOST;
let mailport = database.MAIL_PORT;

let sendmail = (to, subject, htmlcontent) => {
    let transporter = nodemailer.createTransport({
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
        html: htmlcontent,
    }
    return transporter.sendMail(options);
};
module.exports = sendmail;