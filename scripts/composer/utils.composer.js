const { Composer, Markup } = require("telegraf");
const composer = new Composer();
const GiphyToken = process.env.GIPHY_TOKEN;
const db = require("../database.js");
const text = require("../text.json");

const ChoiceInlineKeyboard = Markup.inlineKeyboard([
  [Markup.button.callback(text.pic, "pic"), Markup.button.callback(text.gif, "gif")],
  [Markup.button.callback(text.sendToKittenButton, "sendToKitten")],
]);

composer.command("pic", async (ctx) => {
  try {
    const response = await fetch("https://api.thecatapi.com/v1/images/search");
    const json = await response.json();
    await ctx.replyWithPhoto(json[0].url, ChoiceInlineKeyboard);
  } catch (e) {
    console.error(e);
  }
});
composer.action("pic", async (ctx) => {
  try {
    const response = await fetch("https://api.thecatapi.com/v1/images/search");
    const json = await response.json();
    await ctx.telegram.editMessageReplyMarkup(
      ctx.chat.id,
      ctx.callbackQuery.message.message_id,
      null
    );
    await ctx.replyWithPhoto(json[0].url, ChoiceInlineKeyboard);
  } catch (e) {
    console.error(e);
  }
});

composer.command("gif", async (ctx) => {
  try {
    const search = ctx.message.text.slice(5);
    const response = await fetch(
      `https://api.giphy.com/v1/gifs/random?api_key=${GiphyToken}&tag='cat ${search}'`
    );
    const json = await response.json();
    ctx.replyWithAnimation(json.data.images.original.url, ChoiceInlineKeyboard);
  } catch (e) {
    console.error(e);
  }
});
composer.action("gif", async (ctx) => {
  try {
    const response = await fetch(
      `https://api.giphy.com/v1/gifs/random?api_key=${GiphyToken}&tag='cat'`
    );
    const json = await response.json();
    await ctx.replyWithAnimation(json.data.images.original.url, ChoiceInlineKeyboard);
    await ctx.telegram.editMessageReplyMarkup(
      ctx.chat.id,
      ctx.callbackQuery.message.message_id,
      null
    );
  } catch (e) {
    console.error(e);
  }
});

composer.command("kitten", async (ctx) => {
  const user = await db.user(ctx.message.from.id);
  await ctx.reply(text.newKitten);
  await ctx.reply(eval("`" + text.kittenLink + "`"), {
    disable_web_page_preview: true,
  });
  if (user["kitten"]) {
    const kitten = await db.user(user["kitten"]);
    ctx.reply(eval("`" + text.kittenWarning + "`"));
  }
});

composer.command("kittens_language", (ctx) => {
  try {
    ctx.reply(text.language, {
      disable_web_page_preview: true,
    });
  } catch (e) {
    console.error(e);
  }
});

composer.command("kittens_stickers", (ctx) => {
  try {
    ctx.reply(text.stikerpack, {
      disable_web_page_preview: true,
    });
  } catch (e) {
    console.error(e);
  }
});

composer.hears(["кис кис", "кис", "кис кис кис", "кискис", "кискискис"], async (ctx) => {
  try {
    await ctx.replyWithPhoto(
      "https://i.pinimg.com/736x/3d/fa/4e/3dfa4e645c9866a7e18abfb1161af9f6.jpg"
    );
  } catch (e) {
    console.error(e);
  }
});

module.exports = composer;
