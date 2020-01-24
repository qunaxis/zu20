const Telegraf  = require('telegraf')
import db from './models/index'

const { BOT_TOKEN } = process.env



let bot = {}
let chatId = 293233794 // Мой ИД для уведомлений

try {
    bot = new Telegraf(BOT_TOKEN, { webhookReply: false })
    bot.telegram.sendMessage(chatId, 'Я перезагрузился и теперь активен. Жду Ваших приказаний, сэр!')
    console.log(`BOT IS ENABLED`)
} catch(error) {
    console.log(error)
}

// Base commands
bot.start(ctx => ctx.reply('Привет!\nЯ создан для обновления информации в профилях иммунов.\n\n/help - список команд'))
bot.help(ctx => ctx.reply('Команды:\n/status для получения текущего положения дел в мире\n/infected [%] - установить долю инфицированных\n/antidot [%] - установить % готовности антидота\n/timer [XX:XX] - установить время дедлайна'))

// Info commands
bot.command('/status', ctx => {
    const status = db.getStatus()
    console.log(status)
    ctx.reply(`Прогресс разработки антидота: ${antidot}%\nДоля зараженных: ${infected}%\nВремя таймера: ${deadline}`)
})



bot.launch()



module.exports = bot