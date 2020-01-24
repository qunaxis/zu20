const Telegraf  = require('telegraf')
import db from './models/index'



let bot = {}
let chatId = 293233794 // Мой ИД для уведомлений

bot.start(ctx => ctx.reply('Привет!\nЯ создан для обновления информации в профилях иммунов.\n\n/help - список команд'))
bot.help(ctx => ctx.reply('Команды:\n/status для получения текущего положения дел в мире\n/infected [%] - установить долю инфицированных\n/antidot [%] - установить % готовности антидота\n/timer [XX:XX] - установить время дедлайна'))

bot.launch()



module.exports = bot