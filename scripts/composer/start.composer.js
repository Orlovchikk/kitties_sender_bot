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
          await db.addUserToDB(user.id, user.username, user.first_name, kitten);
          await db.updateKitten(kitten, user.id);
        }
        ctx.telegram.sendMessage(kitten, eval("`" + text.kitten + "`"));
        ctx.reply(eval("`" + text.kitten2 + "`"));
      } else {
        ctx.reply(text.kittenError);
      }
    } else if (!(await db.user(user.id))) {
      db.addUserToDB(user.id, user.username, user.first_name);
    }
  } catch (e) {
    console.error(e);
  }
});

composer.help((ctx) => {
  try {
    ctx.reply(eval("`" + text.help + "`"));
  } catch (e) {
    console.error(e);
  }
});

module.exports = composer;
