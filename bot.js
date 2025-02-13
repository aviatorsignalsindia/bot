const TelegramBot = require("node-telegram-bot-api");
const token = "7718058336:AAEaOQZtHVMi-B9S7_cyM_5WxCAGnZnWDo0";
const bot = new TelegramBot(token, { polling: true });

let currentSignal = null; // Инициализация переменной сигнала
let signalTime = 0; // Инициализация времени
let countdownInterval; // Инициализация переменной для обратного отсчета

// Форматирование времени
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}m ${secs}s`;
}

// Запуск обратного отсчета (пример)
function startCountdown(chatId) {
  countdownInterval = setInterval(() => {
    signalTime--;
    if (signalTime <= 0) {
      clearInterval(countdownInterval);
      currentSignal = null; // Сбрасываем сигнал после окончания
      // Убираем вывод сообщения при истечении времени
    }
  }, 1000);
}

// Логируем сообщение о запуске бота
console.log("Бот запущен...");

// Обработчик команды /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const opts = {
    reply_markup: {
      inline_keyboard: [[{ text: "Get Signal", callback_data: "get_signal" }]],
    },
  };
  bot.sendMessage(
    chatId,
    "🚀 Welcome to the Aviator Predictor Bot!\n\nSignals are generated based on AI and mathematics. To use the signals, please register at the following link: https://1win.tz/v3/reg-form-aviator?p=2lmq and play specifically at the 1win casino, as signals will not work elsewhere.\n\nRecommendation: After doubling your bankroll, take a break for 24 hours.\n\nInstructions:\n1. Click on 'Get Signal'.\n2. Wait for the coefficient to display.\n3. Place your bet when instructed.\n4. After the signal, you can click 'Get New Signal' for the next one.",
    opts
  );
  console.log("Command /start received");
});

// Обработчик callback_query
bot.on("callback_query", (query) => {
  const chatId = query.message.chat.id;
  console.log("Received callback query:", query.data);

  // Логируем текущее значение currentSignal
  console.log("Current Signal before processing:", currentSignal);

  if (query.data === "get_signal" || query.data === "get_new_signal") {
    console.log(`Button '${query.data}' pressed`);
    if (!currentSignal) {
      // Генерация нового сигнала, если его нет
      currentSignal = Math.floor(Math.random() * 10) + 1; // Пример генерации нового сигнала
      signalTime = 180; // Установка времени (можно настроить)

      let signalMessage = `🚀 Signal generated! 🎰 Current coefficient: ${currentSignal}\nTime remaining: ${formatTime(
        signalTime
      )}`;
      const opts = {
        reply_markup: {
          inline_keyboard: [
            [{ text: "Get New Signal", callback_data: "get_new_signal" }],
          ],
        },
      };
      bot.sendMessage(chatId, signalMessage, opts);
      startCountdown(chatId); // Запуск обратного отсчета
    } else {
      // Если текущий сигнал существует, показываем оставшееся время
      let remainingTimeMessage = `🚀 Current Signal: ${currentSignal}\nTime remaining: ${formatTime(
        signalTime
      )}`;
      const opts = {
        reply_markup: {
          inline_keyboard: [
            [{ text: "Get New Signal", callback_data: "get_new_signal" }],
          ],
        },
      };
      bot.sendMessage(chatId, remainingTimeMessage, opts);
    }
  }

  // Логируем текущее значение currentSignal после обработки
  console.log("Current Signal after processing:", currentSignal);
});
