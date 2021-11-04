const state = require('./state.js')
const mail = require('./mail.js')

function add (address, chatId) {
  if (!address.includes('@')) throw new Error('invalid-address')
  try {
    state.give('subscribers', {
      address,
      chatId
    })
    state.give('chatIds', chatId)
    return state.get('subscribers')
  } catch(error) {
    return error
  }
}

function remove (address, chatId) {
  if (!address.includes('@')) throw new Error('invalid-address')
  try {
    state.take('subscribers', {
      address,
      chatId
    })
    if (state.get('subscribers').filter((subscriber) => subscriber.chatId === chatId).length === 0) {
      state.take('chatIds', chatId)
    }
    return state.get('subscribers')
  } catch (error) {
    return error
  }
}

function send (chatId) {
  try {
    const messages = state.getChat(chatId)
    if (messages.length === 0) throw new Error('no-messages')
    const html = messages.map((message) => `${message.name}, ${new Date(message.date).toISOString()}<br>${message.text}`).join('<br><br>')
    const subscribers = state.getSubscribers(chatId)
    subscribers.map((subscriber) => {
      mail.send(subscriber.address, `Chats from ${chatId}`, html)
    })
    return subscribers
  } catch (error) {
    return error
  }
}

module.exports = {
  add,
  remove,
  send
}