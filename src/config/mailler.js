import nodemailer from "nodemailer";
let MAIL_USER = "nvbinh.mern@gmail.com";
let MAIL_PASSWORD = "Binhviet";
let MAIL_HOST = "smtp.gmail.com";
let MAIL_PORT = 587;

let admail = MAIL_USER;
let adpassword = MAIL_PASSWORD;
let mailhost = MAIL_HOST;
let mailport = MAIL_PORT;

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
    return transporter.sendmail(options);
}