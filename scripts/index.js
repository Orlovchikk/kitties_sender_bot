require("dotenv").config();
const { Telegraf } = require("telegraf");
const { connectDB } = require("./database.js"); // <--- 1. Импортируем вашу функцию

const TelegramToken = process.env.TELEGRAM_TOKEN;
const bot = new Telegraf(TelegramToken);

// Создаем асинхронную функцию для запуска всего приложения
async function start() {
  try {
    console.log("Подключаюсь к базе данных...");
    await connectDB(); // <--- 2. ВЫЗЫВАЕМ и дожидаемся подключения

    console.log("База данных подключена. Запускаю бота...");

    // comands start и help
    bot.use(require("./composer/start.composer.js"));

    // commands pic, gif, kitten, kittens_language, kittens_stickers, 'кис кис'
    bot.use(require("./composer/utils.composer.js"));

    // command send_to_kitten
    bot.use(require("./scenes/send_to_kitten.scene.js"));

    // 3. Запускаем бота только после успешного подключения
    bot.launch(); 
    console.log("Бот успешно запущен!");

  } catch (error) {
    console.error("Произошла критическая ошибка при запуске:", error);
  }
}

// Запускаем нашу главную функцию
start();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
