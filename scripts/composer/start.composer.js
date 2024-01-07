const { Composer } = require("telegraf")
const composer = new Composer
const db = require('../database')
const text = require('../text')

composer.start(async (ctx) => {
  try {
    const kitten = Number(ctx.message.text.slice(7)),
      user = ctx.message.from
    await ctx.reply(text.start)
    if (kitten) {
      if (ctx.message.from.id !== kitten) {
        try {
          const userDB = await db.user(user.id)
          if (userDB) {
            await db.deleteKitten(user.id)
            await db.deleteKitten(kitten)
            await db.updateKitten(kitten, user.id)
            await db.updateKitten(user.id, kitten)
          }
          else {
            await db.deleteKitten(kitten)
            await db.addUserToDB(user.id, user.username, kitten)
            await db.updateKitten(kitten, user.id)
          }
          ctx.telegram.sendMessage(kitten, text.kitten)
          ctx.reply(text.kitten2)
        } catch (e) {
          console.error(e)
        }
      } else {
        ctx.reply(text.kittenError)
      }
    } else if (! await db.user(user.id)) {
      db.addUserToDB(user.id, user.username)
    } 
  } catch (e) {
    console.error(e)
  }
})

composer.help((ctx) => {
  try {
    ctx.replyWithHTML(`воть все доступные команды:\n${text.commands} так же попробуй позвать котика по кис кис 🤭`)
  } catch (e) {
    console.error(e)
  }
})

module.exports = composer