const { Composer, Markup } = require("telegraf")
const composer = new Composer
const GiphyToken = process.env.GIPHY_TOKEN
const db = require('../database')
const text = require('../text')

const ChoiceInlineKeyboard = Markup.inlineKeyboard([[
  Markup.button.callback(text.pic, 'pic'),
  Markup.button.callback(text.gif, 'gif'),
], [
  Markup.button.callback(text.sendToKittenButton, 'sendToKitten')
]])

composer.command('pic', async (ctx) => {
  try {
    const response = await fetch("https://api.thecatapi.com/v1/images/search");
    const json = await response.json();
    await ctx.replyWithPhoto(json[0].url, ChoiceInlineKeyboard)
  } catch (e) {
    console.error(e)
  }
})
composer.action('pic', async (ctx) => {
  try {
    const response = await fetch("https://api.thecatapi.com/v1/images/search");
    const json = await response.json();
    await ctx.telegram.editMessageReplyMarkup(ctx.chat.id, ctx.callbackQuery.message.message_id, null);
    await ctx.replyWithPhoto(json[0].url, ChoiceInlineKeyboard)
  } catch (e) {
    console.error(e)
  }
})

composer.command('gif', async (ctx) => {
  try {
    const search = ctx.message.text.slice(5)
    const response = await fetch(`https://api.giphy.com/v1/gifs/random?api_key=${GiphyToken}&tag='cat ${search}'`);
    const json = await response.json();
    ctx.replyWithAnimation(json.data.images.original.url, ChoiceInlineKeyboard)
  } catch (e) {
    console.error(e)
  }
})
composer.action('gif', async (ctx) => {
  try {
    const response = await fetch(`https://api.giphy.com/v1/gifs/random?api_key=${GiphyToken}&tag='cat'`);
    const json = await response.json();
    await ctx.replyWithAnimation(json.data.images.original.url, ChoiceInlineKeyboard)
    await ctx.telegram.editMessageReplyMarkup(ctx.chat.id, ctx.callbackQuery.message.message_id, null);
  } catch (e) {
    console.error(e)
  }
})

composer.action('sendToKitten', async (ctx) => {
  try {
    const msg = ctx.update.callback_query.message
    const sender = await db.user(ctx.update.callback_query.from.id)
    if (sender['kitten']) {
      if (msg?.photo) {
        await ctx.telegram.sendPhoto(sender['kitten'], `${msg.photo[0].file_id}`)
        await ctx.telegram.sendMessage(sender['kitten'], `^^^ сообщение от @${sender['username']} ^^^`)
        await ctx.reply(text.successful)
      }
      else if (msg?.sticker || msg?.animation) {
        await ctx.telegram.sendAnimation(sender['kitten'], `${msg?.sticker?.file_id || msg?.animation?.file_id}`)
        await ctx.telegram.sendMessage(sender['kitten'], `^^^ сообщение от @${sender['username']} ^^^`)
        await ctx.reply(text.successful)
      }
    } else ctx.reply(text.sendToKittenError)
    await ctx.telegram.editMessageReplyMarkup(ctx.chat.id, ctx.callbackQuery.message.message_id, null);
  } catch (e) {
    console.error(e)
  }
})

composer.command('kitten', async (ctx) => {
  const user = await db.user(ctx.message.from.id)
  await ctx.reply(`отправь это своему котику:`)
  await ctx.reply(`https://t.me/kitties_sender_bot?start=${user['id']} - ссылочка для обмена милотой в боте`, { disable_web_page_preview: true })
  if (user['kitten']) {
    const kitten = await db.user(user['kitten'])
    ctx.reply(`⚠️ осторожно, ты уже привязан к @${kitten['username']} ⚠️\nесли кто-то нажмет на ссылочку, ваша ниточка разорвется!`)
  }
})

composer.command('kittens_language', (ctx) => {
  try {
    ctx.reply(text.language, { disable_web_page_preview: true })
  } catch (e) {
    console.error(e)
  }
})

composer.hears(['кис кис', 'кис', 'кис кис кис', 'кискис', 'кискискис'], async (ctx) => {
  try {
    await ctx.replyWithPhoto('https://i.pinimg.com/736x/3d/fa/4e/3dfa4e645c9866a7e18abfb1161af9f6.jpg')
  } catch (e) {
    console.error(e)
  }
})

module.exports = composer