const Scenes = require('telegraf/scenes')
const { Markup } = require("telegraf")
const db = require('../mongoDB')


module.exports = new Scenes.WizardScene(
  'send_to_kitten',
  async (ctx) => {
    await ctx.reply('можно отправить котику:\n> текстик\n> картиночку\n> стикерочек\n> гифочку\n       ≽^•⩊•^≼', Markup.keyboard(
      [['отмена']]
    ).resize())
    return ctx.wizard.next()
  },
  async (ctx) => {
    let msg = ctx.message,
      sender = await db.user(ctx.message.from.id)
    if (msg.text === 'отмена') {
      ctx.reply('операция отправки милоты котику отменена', Markup.removeKeyboard())
      ctx.scene.leave()
      return
    }
    if (msg?.text) await ctx.telegram.sendMessage(sender['kitten'], `${msg.text}`, { entities: msg.entities })
    else if (msg?.photo) await ctx.telegram.sendPhoto(sender['kitten'], `${msg.photo[0].file_id}`)
    else if (msg?.sticker || msg?.animation) await ctx.telegram.sendAnimation(sender['kitten'], `${msg?.sticker?.file_id || msg?.animation?.file_id}`)
    else {
      ctx.reply('это не выглядит как что-то, что я могу отправить\nпопробуй еще раз :3')
      ctx.scene.reenter()
      return
    }
    await ctx.telegram.sendMessage(sender['kitten'], `^^^ сообщение от @${sender['username']} ^^^`)
    ctx.reply('(*・‿・)ノ⌒*:･ﾟ✧ отправлено!', Markup.removeKeyboard())
    return ctx.scene.leave()
  }
)