require("dotenv").config();
const { Telegraf } = require("telegraf");
const { connectDB } = require("./database.js");

const TelegramToken = process.env.TELEGRAM_TOKEN;
const bot = new Telegraf(TelegramToken);

async function start() {
  try {
    console.log("Connecting to database...");
    await connectDB();

    console.log("Launching the bot...");

    // comands start и help
    bot.use(require("./composer/start.composer.js"));

    // commands pic, gif, kitten, kittens_language, kittens_stickers, 'кис кис'
    bot.use(require("./composer/utils.composer.js"));

    // command send_to_kitten
    bot.use(require("./scenes/send_to_kitten.scene.js"));

    bot.launch(); 
    console.log("Bot is up!");

  } catch (error) {
    console.error("Error during launch:", error);
  }
}

// Запускаем нашу главную функцию
start();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
