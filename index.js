require('dotenv').config()
const { ImapFlow } = require('imapflow')

const client = new ImapFlow({
  host: 'imap.gmail.com',
  port: 993,
  secure: true,
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD
  }
})

console.log(process.env.MAIL_USERNAME, process.env.MAIL_PASSWORD)

async function check () {
  await client.connect()
  const lock = await client.getMailboxLock('INBOX')

  try {
    const message = await client.fetchOne(client.mailbox.exists, { source: true })
    console.log(message.source.toString())

    for await (let message of client.fetch('1:*', { envelope: true })) {
      if (message.subject === 'add me') {
        console.log(message)
      }
    }
  } finally {
    lock.release()
  }

  await client.logout()
}

check()/* .catch(err => console.error(err)) */
