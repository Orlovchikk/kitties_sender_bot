const { Composer } = require("telegraf");
const composer = new Composer();
const db = require("../database.js");
const text = require("../text.json");

composer.start(async (ctx) => {
  try {
    const kitten = Number(ctx.message.text.slice(7)),
      user = ctx.message.from;
    await ctx.reply(text.start);
    if (kitten) {
      if (ctx.message.from.id !== kitten) {
        const userDB = await db.user(user.id);
        if (userDB) {
          await db.updateKitten(user.id, kitten);
        } else {
          await db.addUserToDB(user.id, user.username, kitten);
          await db.updateKitten(kitten, user.id);
        }
        const kittenUsername = await db.user(kitten);
        ctx.telegram.sendMessage(
          kitten,
          `теперь вы с @${user.username} связаны!\nможешь попробовать отправить второму котику сообщение через /send_to_kitten`
        );
        ctx.reply(
          `теперь вы с @${kittenUsername["username"]} связаны!\nможешь попробовать отправить второму котику сообщение через /send_to_kitten`
        );
      } else {
        ctx.reply(text.kittenError);
      }
    } else if (!(await db.user(user.id))) {
      db.addUserToDB(user.id, user.username);
    }
  } catch (e) {
    console.error(e);
  }
});

composer.help((ctx) => {
  try {
    ctx.replyWithHTML(
      `воть все доступные команды:\n${text.commands} так же попробуй позвать котика по кис кис 🤭`
    );
  } catch (e) {
    console.error(e);
  }
});

module.exports = composer;
