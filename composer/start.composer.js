const { Composer } = require("telegraf")
const composer = new Composer
const commands = require('../text')

//lets imagine that it is a real database ^.^
const DB = require('../users_database.json').USERS

composer.start(async (ctx) => {
  try {
    await ctx.reply(
      `привет котик 🥰
    \n/pic чтобы получить рандомную картинку
    \n/gif чтобы получить гифку с котиком
    \n/kitten - привязать котика и пересылать ему картиночки
    \n/help чтобы посмотреть другие команды`
    )

    let reffer = +ctx.message.text.slice(7)
    if (reffer) {
      if (ctx.message.from.id !== reffer) {
        try {
          DB[reffer]['kittenID'] = ctx.message.from.id
          DB[ctx.message.from.id]['kittenID'] = reffer
          DB[ctx.message.from.id]['username'] = ctx.message.from.username
          ctx.telegram.sendMessage(reffer, `котик привязан!\nможешь попробовать отправить ему сообщение через /send_to_cutie`)
          ctx.reply(`тебя привязали!\nможешь попробовать отправить второму котику сообщение через /send_to_cutie`)
        } catch (e) {
          console.error(e)
        }
      } else {
        ctx.reply('ты не можешь привязать самого себя :(')
      }
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