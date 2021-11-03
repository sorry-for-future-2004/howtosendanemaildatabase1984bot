require('dotenv').config()
const state = require('./state.js')
const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: process.env.MAIL_SERVICE,
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD
  }
})

function send (address, subject, html) {
  transporter.sendMail({
    from: process.env.MAIL_USERNAME,
    to: address,
    subject,
    html
  }, (error, info) => {
    if (error) {
      console.log(error)
    } else {
      console.log('email sent', address, subject)
    }
  })
}

module.exports = {
  send
}
