require('dotenv').config()
const { Telegraf, Scenes, session } = require('telegraf')
const TelegramToken = process.env.TELEGRAM_TOKEN
const { Markup } = require("telegraf")

//lets imagine that it is a real database ^.^
const DB = require('./users_database.json').USERS

const bot = new Telegraf(TelegramToken)

// команды start и help
bot.use(require('./composer/start.composer'))

// команды pic, gif, kitten, kittens_language, отзывание на 'кис'
bot.use(require('./composer/utils.composer'))

// команда send_to_cutie
const stage = new Scenes.Stage([require('./scenes/send_to_cutie.scene')]);
bot.use(session());
bot.use(stage.middleware());

bot.command('send_to_cutie', (ctx) => {
  try {
    if (DB[ctx.message.from.id]['kittenID']) ctx.scene.enter('send_to_cutie')
    else ctx.reply('сначала привяжи себе котика через /kitten \n^.^ ')
  } catch(e) {
    console.error(e)
  }
})

bot.launch().then(console.log(`перезапущен в ${new Date().getHours()}:${new Date().getMinutes()}`))

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))