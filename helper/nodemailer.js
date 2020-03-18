
//sandi = ocafkmeomazamnzt ======= email 
//nodemailer digunakan untuk memberikan verifikasi kepada user melalui password
const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'tickatickat@gmail.com',
        pass: 'ocafkmeomazamnzt'
    },
    tls: {
        rejectUnauthorized: false
    }
})

module.exports = transporter;