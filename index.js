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
          utils.sendAll()
          state.drop()
        } catch (error) {
          console.log(error)
        }
      }
    })
  }, 1000 * 60)
}

init()
