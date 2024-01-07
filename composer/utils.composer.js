const { Composer, Markup } = require("telegraf")
const composer = new Composer
const GiphyToken = process.env.GIPHY_TOKEN
const db = require('../mongoDB')

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

composer.command('kitten', async (ctx) => {
  const user = await db.user(ctx.message.from.id)
  await ctx.reply(`отправь это своему котику:`)
  await ctx.reply(`https://t.me/kitties_sender_bot?start=${user['id']} - ссылочка для обмена милотой в боте`, { disable_web_page_preview: true })
  if (user['kitten']) {
    await ctx.reply(`⚠️ осторожно, может быть привязан только один котик ⚠️\nесли кто-то нажмет на ссылочку, ваша ниточка разорвется!`)
  }
})

composer.command('kittens_language', (ctx) => {
  try {
    ctx.reply('≽^•⩊•^≼ \nнажми на ссылочку для установки котячего языка\nhttps://t.me/setlanguage/kittens-cats', { disable_web_page_preview: true })
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