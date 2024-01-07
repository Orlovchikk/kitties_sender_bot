require('dotenv').config()
const { Telegraf, Scenes, session } = require('telegraf')
const TelegramToken = process.env.TELEGRAM_TOKEN
const db = require('./mongoDB')
const text = require('./text')

const bot = new Telegraf(TelegramToken)

// comands start и help
bot.use(require('./composer/start.composer'))

// commands pic, gif, kitten, kittens_language, 'кис'
bot.use(require('./composer/utils.composer'))

// command send_to_kitten
const stage = new Scenes.Stage([require('./scenes/send_to_kitten.scene')]);
bot.use(session());
bot.use(stage.middleware());
bot.command('send_to_kitten', async (ctx) => {
  try {
    const kitten = await db.user(ctx.message.from.id)
    if (kitten['kitten']) ctx.scene.enter('send_to_kitten')
    else ctx.reply(text.sendToKittenError)
  } catch(e) {
    console.error(e)
  }
})

bot.launch()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
