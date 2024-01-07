const Scenes = require('telegraf/scenes')
const { Markup } = require("telegraf")

//lets imagine that it is a real database ^.^
const DB = require('../users_database.json').USERS

module.exports = new Scenes.WizardScene(
  'send_to_cutie',
  async (ctx) => {
    await ctx.reply('можно отправить котику:\n> текстик\n> картиночку\n> стикерочек\n> гифочку\n       ≽^•⩊•^≼', Markup.keyboard(
      [['отмена']]
    ).resize())
    return ctx.wizard.next()
  },
  async (ctx) => {
    let userID = ctx.message.from.id,
      msg = ctx.message
    if (msg.text === 'отмена') {
      ctx.reply('операция отправки милоты котику отменена', Markup.removeKeyboard())
      ctx.scene.leave()
      return
    }
    if (msg?.text) await ctx.telegram.sendMessage(DB[userID]['kittenID'], `${msg.text}`, { entities: msg.entities })
    else if (msg?.photo) await ctx.telegram.sendPhoto(DB[userID]['kittenID'], `${msg.photo[0].file_id}`)
    else if (msg?.sticker || msg?.animation) await ctx.telegram.sendAnimation(DB[userID]['kittenID'], `${msg?.sticker?.file_id || msg?.animation?.file_id}`)
    else {
      ctx.reply('это не выглядит как что-то, что я могу отправить\nпопробуй еще раз :3')
      ctx.scene.reenter()
      return
    }
    await ctx.telegram.sendMessage(DB[userID]['kittenID'], `^^^ сообщение от @${DB[userID]['username']} ^^^`)
    ctx.reply('(*・‿・)ノ⌒*:･ﾟ✧ отправлено!', Markup.removeKeyboard())
    return ctx.scene.leave()
  }
)