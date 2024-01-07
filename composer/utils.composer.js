const { Composer, Markup } = require("telegraf")
const composer = new Composer
const GiphyToken = process.env.GIPHY_TOKEN

//lets imagine that it is a real database ^.^
const DB = require('../users_database.json').USERS

const ChoiceInlineKeyboard = Markup.inlineKeyboard([
  Markup.button.callback('пикча', 'pic'),
  Markup.button.callback('гифка', 'gif')
])

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
    const response = await fetch(`https://api.giphy.com/v1/gifs/random?api_key=${GiphyToken}&tag='cat'`);
    const json = await response.json();
    ctx.replyWithAnimation(json.data.images.original.url, ChoiceInlineKeyboard)
  } catch (e) {
    console.error(e)
  }
})
composer.action('gif', async (ctx) => {
  try {
    const response = await fetch(`https://api.giphy.com/v1/gifs/random?api_key=${GiphyToken}&tag='cat christmas'`);
    const json = await response.json();
    ctx.replyWithAnimation(json.data.images.original.url, ChoiceInlineKeyboard)
    ctx.telegram.editMessageReplyMarkup(ctx.chat.id, ctx.callbackQuery.message.message_id, null);
  } catch (e) {
    console.error(e)
  }
})

composer.command('kitten', (ctx) => {
  ctx.reply(`отправь это своему котику:`)
  ctx.reply(`https://t.me/kitties_sender_bot?start=${ctx.message.from.id} - ссылочка для обмена милотой в боте`, {disable_web_page_preview: true})
})

composer.command('kittens_language', (ctx) => {
  try {
    ctx.reply('≽^•⩊•^≼ \nнажми на ссылочку для установки котячего языка\nhttps://t.me/setlanguage/kittens-cats', {disable_web_page_preview: true})
  } catch (e) {
    console.error(e)
  }
})

composer.hears('кис кис', async (ctx) => {
  try {
    ctx.replyWithPhoto('https://i.pinimg.com/736x/3d/fa/4e/3dfa4e645c9866a7e18abfb1161af9f6.jpg')
  } catch (e) {
    console.error(e)
  }
})


module.exports = composer