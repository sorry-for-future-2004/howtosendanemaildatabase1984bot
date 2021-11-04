require('dotenv').config()
const state = require('./state.js')
const utils = require('./utils.js')
const { Bot } = require('grammy')

const bot = new Bot(process.env.BOT_TOKEN)

function init () {
  bot.on('message:text', (ctx) => {
    const chatId = ctx.message.chat.id

    if (ctx.message.text.startsWith('/add')) {
      const address = ctx.message.text.replace('/add ', '')

      try {
        utils.add(address, chatId)
        ctx.reply(`${address} was added`)
        console.log(`${address}, ${chatId} was added`)
      } catch (error) {
        console.log(error)
        if (error.message === 'invalid-address') {
          ctx.reply(`please provide valid email address`)
        } else {
          ctx.reply(`${address} is already part of this chat`)
        }
      }

      return
    }

    if (ctx.message.text.startsWith('/remove')) {
      const address = ctx.message.text.replace('/remove ', '')

      try {
        utils.remove(address, chatId)
        ctx.reply(`${address} was removed`)
        console.log(`${address}, ${chatId} was removed`)
      } catch (error) {
        console.log(error)
        if (error.message === 'invalid-address') {
          ctx.reply(`please provide valid email address`)
        } else {
          ctx.reply(`${address} is not part of this chat`)
        }
      }

      return
    }

    if (ctx.message.text.startsWith('/send')) {
      try {
        const subscribers = utils.send(chatId)
        ctx.reply(`shared chat w/ ${subscribers.map((s) => s.address).join(', ')}`)
      } catch (error) {
        console.log(error)
        ctx.reply(`no messages to send`)
      }

      return
    }

    if (!state.get('chatIds').includes(chatId)) return console.log(`no one subscribed to this chat (${chatId})`)
  
    state.give('store', {
      username: ctx.message.from.username,
      name: ctx.message.from.first_name,
      text: ctx.message.text,
      date: ctx.message.date,
      chatId
    })
  })

  bot.start()
}

module.exports = {
  init
}