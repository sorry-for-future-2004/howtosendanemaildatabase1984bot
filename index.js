require('dotenv').config()
const state = require('./utils/state.js')
const utils = require('./utils/utils.js')
const telegram = require('./utils/telegram.js')

async function init () {
  await state.init()
  await telegram.init()

  setInterval(() => {
    const d = new Date()
    state.settings.times.map((time) => {
      if (d.getHours() === time[0] && d.getMinutes() === time[1]) {
        try {
          const subscribers = utils.sendAll()
          state.drop()
          console.log(`shared chat w/ ${subscribers.map((s) => s.address).join(', ')}`)
        } catch (error) {
          console.log(error)
          console.log(`no messages to send`)
        }
      }
    })
  }, 1000 * 60)
}

init()
