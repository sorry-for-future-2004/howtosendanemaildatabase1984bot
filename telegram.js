require('dotenv').config()
const state = require('./state.js')
const mail = require('./mail.js')
const { Telegraf } = require('telegraf')

const bot = new Telegraf(process.env.BOT_TOKEN)

function init () {
  bot.on('text', (ctx) => {
    const chatId = ctx.update.message.chat.id

    if (ctx.update.message.text.startsWith('/add')) {
      const address = ctx.update.message.text.replace('/add ', '')

      if (!address.includes('@')) return ctx.reply(`please provide valid email address`)
      try {
        state.mutate('subscribers', {
          address,
          chatId
        })
        state.mutate('chatIds', chatId)
        ctx.reply(`${address} was added`)
      } catch(e) {
        ctx.reply(`${address} is already part of this chat`)
      }
      return
    }

    if (ctx.update.message.text.startsWith('/send')) {
      try {
        const messages = state.getChat(chatId)
        const html = messages.map((message) => `${message.name}, ${new Date(message.date).toISOString()}<br>${message.text}`).join('<br><br>')
        const subscribers = state.getSubscribers(chatId)
        subscribers.map((subscriber) => {
          mail.send(subscriber.address, `Chats from ${chatId}`, html)
          console.log(subscriber.address, `Chats from ${chatId}`, html)
        })
      } catch(e) {
        ctx.reply(`no messages to send`)
      }
      return
    }

    if (!state.get('chatIds').includes(chatId)) return console.log(`no one subscribed to this chat (${chatId})`)
  
    state.mutate('store', {
      username: ctx.update.message.from.username,
      name: ctx.update.message.from.first_name,
      text: ctx.update.message.text,
      date: ctx.update.message.date,
      chatId
    })
  })

  bot.launch()
}

module.exports = {
  init
}