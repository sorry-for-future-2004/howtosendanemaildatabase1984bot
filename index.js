require('dotenv').config()
const { ImapFlow } = require('imapflow')
const nodemailer = require('nodemailer')
const { Telegraf } = require('telegraf')

const client = new ImapFlow({
  host: 'imap.gmail.com',
  port: 993,
  secure: true,
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD
  }
})

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD
  }
})

const bot = new Telegraf(process.env.BOT_TOKEN)

const state = {
  subscribers: []
}

console.log(process.env.MAIL_USERNAME, process.env.MAIL_PASSWORD)

async function send (address, subject, text) {
  transporter.sendMail({
    from: process.env.MAIL_USERNAME,
    to: address,
    subject,
    text
  }, (error, info) => {
    if (error) {
      console.log(error)
    } else {
      console.log('email sent', address, subject)
    }
  })
}

async function check () {
  await client.connect()
  const lock = await client.getMailboxLock('INBOX')

  try {
    const message = await client.fetchOne(client.mailbox.exists, { source: true })
    console.log(message.source.toString())

    for await (let message of client.fetch('1:*', { envelope: true })) {
      if (message.envelope.subject.includes('add me') && message.envelope.subject.split(',')[1]) {
        const address = message.envelope.from[0].address
        const chatId = Number(message.envelope.subject.split(',')[1].trim())

        state.subscribers.push({
          address,
          chatId
        })
        send(address, `u r in w/ ${chatId}`, '')
      }
    }
  } finally {
    lock.release()
  }

  await client.logout()
  return
}

async function init () {
  await check()/* .catch(err => console.error(err)) */
  setInterval(() => {
    console.log(state)
  }, 1000 * 60)
}

init()

