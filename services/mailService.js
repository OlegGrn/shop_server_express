const nodemailer = require("nodemailer")


//o6452217@gmail.com
//q]w[eppro


// q]w[eppro
// oleg_gggggg@mail.ru
// 8-981-463-80-91
// пароль для приложения RQaKyPK0QaWnbqAaxenv

class MailService {

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: "smtp.mail.ru", //example
            port: 465, // example
            secure: false, // upgrade later with STARTTLS
            auth: {
                user: "oleg_gggggg@mail.ru", // example
                pass: "RQaKyPK0QaWnbqAaxenv", //example
            },

        })
    }

    async sendActivationMail(to, link) {

        const info = await this.transporter.sendMail({
            from: 'oleg_gggggg@mail.ru', // sender address
            to: to, // list of receivers
            subject: "Hello ✔", // Subject line
            text: "Hello world?", // plain text body_bg
            html: `<b>Hello world?</b>`, // html body_bg
        });

        return info

    }
}

module.exports = new MailService()

