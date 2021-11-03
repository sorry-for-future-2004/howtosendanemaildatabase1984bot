require('dotenv').config()
const state = require('./state.js')
const mail = require('./mail.js')
const telegram = require('./telegram.js')

console.log(state)

async function init () {
  await state.init()
  await telegram.init()

  setInterval(() => {
    const d = new Date()
    if (d.getHours() === state.settings.publish[0] && d.getMinutes() === state.settings.publish[1]) {
      /* send out chats */
      /* remove chats */ /* db.drop() */
      console.log('lessgooo')
    }
    console.log(state)
  }, 1000 * 60)
}

init()
