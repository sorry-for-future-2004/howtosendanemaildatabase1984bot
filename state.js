const fs = require('fs')
const path = require('path')

const settings = {
  file: 'chats.json',
  publish: [18, 0]
}

let state = {
  store: [],
  subscribers: [],
  chatIds: []
}

function getSubscribers(chatId) {
  const subscribers = state.subscribers.filter((subscriber) => subscriber.chatId === chatId)
  if (subscribers.length === 0) {
    throw new Error('no subscribers')
  } else {
    return subscribers
  }
}

function getChat (chatId) {
  if (state.chatIds.includes(chatId)) {
    return state.store.filter((message) => message.chatId === chatId)
  } else {
    throw new Error('no chat')
  }
}

function get (key) {
  return state[key]
}

function mutate (key, value) {
  console.log(key, value)
  switch(key) {
    case 'store':
      state[key].push(value)
      break
    case 'subscribers':
      if (!JSON.stringify(state[key]).includes(JSON.stringify(value))) {
        state[key].push(value)
      } else {
        throw new Error('duplicate')
      }
    case 'chatIds':
      if (!JSON.stringify(state[key]).includes(JSON.stringify(value))) {
        state[key].push(value)
      } else {
        return
      }
  }
}

function save () {
  console.log('savin', JSON.stringify(state, null, 2))
  fs.writeFile(path.join(__dirname, settings.file), JSON.stringify(state, null, 2), 'utf8', (err, data) => {
    if (err) console.log(err)
  })
}

function load () {
  fs.readFile(path.join(__dirname, settings.file), 'utf8', (err, data) => {
    if (err) {
      save()
    }

    if (data) {
      state = JSON.parse(data)
      console.log(state)
    }
  })
}

function store (token) {
  const entry = {
    timestamp: Date.now(),
    token: token
  }

  state.store.push(entry)

  save()
}

function drop () {
  state.store = []
  save()
}

function init () {
  load()
}

process.on('SIGINT', (code) => {
  save()
})

module.exports = {
  init,
  load,
  store,
  drop,
  get,
  mutate,
  getChat,
  getSubscribers,
  settings,
  ...state
}