const { Composer } = require("telegraf")
const composer = new Composer
const commands = require('../text')
const db = require('../mongoDB')

composer.start(async (ctx) => {
  try {
    let kitten = Number(ctx.message.text.slice(7)),
      user = ctx.message.from

    await ctx.reply(
      `привет котик 🥰
    \n/pic чтобы получить рандомную картинку
    \n/gif чтобы получить гифку с котиком
    \n/kitten - привязать котика и пересылать ему картиночки
    \n/help чтобы посмотреть другие команды`
    )
    if (kitten) {
      if (ctx.message.from.id !== kitten) {
        try {
          if (await db.user(user.id)) {
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
          ctx.telegram.sendMessage(kitten, `котик привязан!\nможешь попробовать отправить ему сообщение через /send_to_kitten`)
          ctx.reply(`тебя привязали!\nможешь попробовать отправить второму котику сообщение через /send_to_kitten`)
        } catch (e) {
          console.error(e)
        }
      } else {
        ctx.reply('ты не можешь привязать самого себя :(')
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
    ctx.reply(`воть все доступные команды:\n${text.commands} так же попробуй позвать котика по кис кис 🤭`)
  } catch (e) {
    console.error(e)
  }
})

module.exports = composer