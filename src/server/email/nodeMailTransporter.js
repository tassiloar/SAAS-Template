//Creates trasported object for sending mails 

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.mailgun.org",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
        user: "postmaster@sandboxc37cde3728424ea2914638d8e68120d8.mailgun.org",
        pass: "167e3f5127a165dd6654a83b65988a80-911539ec-64b959e9",
    },
});

export default transporter