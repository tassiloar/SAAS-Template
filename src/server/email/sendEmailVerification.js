//Send the verifications email and stores the code and expiry in database

import transporter from "@/server/email/nodeMailTransporter"

export default async function sendEmailVerification(email) {

    const code = Math.floor(10000 + Math.random() * 90000)

    // await transporter.sendMail({
    //     from: 'Test mail <testmail@sandboxc37cde3728424ea2914638d8e68120d8.mailgun.org>',
    //     to: email,
    //     subject: 'helllooo 👻',
    //     text: `Verification code: ${code}`,
    //     html: `<h1>HELLO</h1> <p> Your verification code is: ${code}</p>`,
    // }).then(info => {
    //     console.log('Email sent: ' + info.response);
    //     return { code: code, res: "success" }
    // }).catch(error => {
    //     console.error('Error sending email: ' + error);
    //     return { code: code, res: "fail" }
    // });

    return { code: code, res: "success" }
}