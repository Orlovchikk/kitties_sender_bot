require("dotenv").config();
const { Telegraf } = require("telegraf");
const TelegramToken = process.env.TELEGRAM_TOKEN;

const bot = new Telegraf(TelegramToken);

// comands start и help
bot.use(require("./composer/start.composer.js"));

// commands pic, gif, kitten, kittens_language, kittens_stickers, 'кис кис'
bot.use(require("./composer/utils.composer.js"));

// command send_to_kitten
bot.use(require("./scenes/send_to_kitten.scene.js"));

bot.launch();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
