require('dotenv').config()
const { Telegraf} = require('telegraf')
const TelegramToken = process.env.TELEGRAM_TOKEN

const bot = new Telegraf(TelegramToken)

// comands start и help
bot.use(require('./composer/start.composer'))

// commands pic, gif, kitten, kittens_language, 'кис кис'
bot.use(require('./composer/utils.composer'))

// test command
bot.use(require('./composer/timer.composer'))

// command send_to_kitten 
bot.use(require('./scenes/send_to_kitten.scene'))

bot.launch()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
