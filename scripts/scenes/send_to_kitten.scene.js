const { Composer, Markup, Scenes, session } = require("telegraf");
const composer = new Composer();
const db = require("../database.js");
const text = require("../text.json");

const sendToKittenInlineKeyboard = Markup.inlineKeyboard([
  [Markup.button.callback(text.sendToKittenResponse, "sendToKittenResponse")],
]);

const sendToKittenScene = new Scenes.WizardScene(
  "send_to_kitten",
  async (ctx) => {
    await ctx.reply(text.sendToKitten, Markup.keyboard([["отмена"]]).resize());
    return ctx.wizard.next();
  },
  async (ctx) => {
    const msg = ctx.message,
      sender = await db.user(ctx.message.from.id || ctx.callbackQuery.message.from.id);
    if (msg.text === "отмена") {
      ctx.reply(text.cancel, Markup.removeKeyboard());
      return ctx.scene.leave();
    }
    if (msg?.text) {
      await ctx.telegram.sendMessage(sender["kitten"], `${msg.text}`, {
        entities: msg.entities,
      });
      await ctx.telegram.sendMessage(
        sender["kitten"],
        eval("`" + text.receiver + "`"),
        sendToKittenInlineKeyboard
      );
      await ctx.reply(text.successful, Markup.removeKeyboard());
    } else if (msg?.photo) {
      await ctx.telegram.sendPhoto(sender["kitten"], `${msg.photo[0].file_id}`);
      await ctx.telegram.sendMessage(
        sender["kitten"],
        eval("`" + text.receiver + "`"),
        sendToKittenInlineKeyboard
      );
      await ctx.reply(text.successful, Markup.removeKeyboard());
    } else if (msg?.sticker || msg?.animation) {
      await ctx.telegram.sendAnimation(
        sender["kitten"],
        `${msg?.sticker?.file_id || msg?.animation?.file_id}`
      );
      await ctx.telegram.sendMessage(
        sender["kitten"],
        eval("`" + text.receiver + "`"),
        sendToKittenInlineKeyboard
      );
      await ctx.reply(text.successful, Markup.removeKeyboard());
    } else {
      await ctx.reply(text.sendError, Markup.removeKeyboard());
      return ctx.scene.reenter();
    }
    return ctx.scene.leave();
  }
);

const stage = new Scenes.Stage([sendToKittenScene]);

composer.use(session());
composer.use(stage.middleware());

composer.command("send_to_kitten", async (ctx) => {
  try {
    const kitten = await db.user(ctx.message.from.id);
    if (kitten["kitten"]) ctx.scene.enter("send_to_kitten");
    else ctx.reply(text.sendToKittenError);
  } catch (e) {
    console.error(e);
  }
});

composer.action("sendToKitten", async (ctx) => {
  try {
    const msg = ctx.update.callback_query.message;
    const sender = await db.user(ctx.update.callback_query.from.id);
    if (sender["kitten"]) {
      if (msg?.photo) {
        await ctx.telegram.sendPhoto(sender["kitten"], `${msg.photo[0].file_id}`);
        await ctx.telegram.sendMessage(
          sender["kitten"],
          eval("`" + text.receiver + "`"),
          sendToKittenInlineKeyboard
        );
        await ctx.reply(text.successful);
      } else if (msg?.animation) {
        await ctx.telegram.sendAnimation(sender["kitten"], `${msg.animation.file_id}`);
        await ctx.telegram.sendMessage(
          sender["kitten"],
          eval("`" + text.receiver + "`"),
          sendToKittenInlineKeyboard
        );
        await ctx.reply(text.successful);
      }
    } else ctx.reply(text.sendToKittenError);
    await ctx.telegram.editMessageReplyMarkup(
      ctx.chat.id,
      ctx.callbackQuery.message.message_id,
      null
    );
  } catch (e) {
    console.error(e);
  }
});

composer.action("sendToKittenResponse", async (ctx) => {
  await ctx.telegram.editMessageReplyMarkup(
    ctx.chat.id,
    ctx.callbackQuery.message.message_id,
    null
  );
  ctx.scene.enter("send_to_kitten");
});

module.exports = composer;
