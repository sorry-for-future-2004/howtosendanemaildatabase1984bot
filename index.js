require('dotenv').config()
const state = require('./utils/state.js')
const telegram = require('./utils/telegram.js')

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
  }, 1000 * 60)
}

init()
