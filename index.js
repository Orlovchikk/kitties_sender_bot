require('dotenv').config()
const { Telegraf, Scenes, session } = require('telegraf')
const TelegramToken = process.env.TELEGRAM_TOKEN
const { Markup } = require("telegraf")
const db = require('./mongoDB')

const bot = new Telegraf(TelegramToken)

// команды start и help
bot.use(require('./composer/start.composer'))

// команды pic, gif, kitten, kittens_language, отзывание на 'кис'
bot.use(require('./composer/utils.composer'))

// команда send_to_kitten
const stage = new Scenes.Stage([require('./scenes/send_to_kitten.scene')]);
bot.use(session());
bot.use(stage.middleware());

bot.command('send_to_kitten', async (ctx) => {
  try {
    const kitten = await db.user(ctx.message.from.id)
    if (kitten['kitten']) ctx.scene.enter('send_to_kitten')
    else ctx.reply('сначала привяжи себе котика через /kitten \n^.^ ')
  } catch(e) {
    console.error(e)
  }
})

bot.launch().then(console.log(`перезапущен в ${new Date().getHours()}:${new Date().getMinutes()}`))

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))