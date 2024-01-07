const Scenes = require('telegraf/scenes')
const { Markup } = require("telegraf")
const db = require('../mongoDB')
const text = require('../text')

module.exports = new Scenes.WizardScene(
  'send_to_kitten',
  async (ctx) => {
    await ctx.reply(text.sendToKitten, Markup.keyboard(
      [['отмена']]
    ).resize())
    return ctx.wizard.next()
  },
  async (ctx) => {
    const msg = ctx.message,
      sender = await db.user(ctx.message.from.id)
    if (msg.text === 'отмена') {
      ctx.reply(text.cancel, Markup.removeKeyboard())
      return ctx.scene.leave()
    }
    if (msg?.text) await ctx.telegram.sendMessage(sender['kitten'], `${msg.text}`, { entities: msg.entities })
    else if (msg?.photo) await ctx.telegram.sendPhoto(sender['kitten'], `${msg.photo[0].file_id}`)
    else if (msg?.sticker || msg?.animation) await ctx.telegram.sendAnimation(sender['kitten'], `${msg?.sticker?.file_id || msg?.animation?.file_id}`)
    else {
      await ctx.reply(text.sendError, Markup.removeKeyboard())
      return ctx.scene.reenter()
    }
    await ctx.telegram.sendMessage(sender['kitten'], `^^^ сообщение от @${sender['username']} ^^^`)
    await ctx.reply(text.successful, Markup.removeKeyboard())
    return ctx.scene.leave()
  }
)