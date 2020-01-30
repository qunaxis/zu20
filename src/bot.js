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
bot.catch((err, ctx) => {
    console.log(`Ooops, encountered an error for ${ctx.updateType}`, err)
    ctx.reply(`Произошла ошибка. Чекай консоль или читай ниже:\n\n`)
})
bot.start(ctx => ctx.reply('Привет!\nЯ создан для обновления информации в профилях иммунов.\n\n/help - список команд'))
bot.help(ctx => ctx.reply('Команды:\n/status для получения текущего положения дел в мире\n/infected [%] - установить долю инфицированных\n/antidot [%] - установить % готовности антидота\n/timer [XX:XX] - установить время дедлайна'))

// Get commands
bot.command('/status', async ctx => {
    const settings = await db.getStatus()
    const { antidot, infected, timer } = settings
    await ctx.reply(`Прогресс разработки антидота: ${antidot}%\nДоля зараженных: ${infected}%\nВремя таймера: ${timer}`)
})

// Set commands
bot.command(`/warn`, async ctx => {
    let message = ctx.message.text.split(' ')
    // console.log(ctx.from)
    let warn = {
        hash: message[1],
        value: parseInt(message[2]),
        author: ctx.from.username
    }
    message.shift()
    message.shift()
    message.shift()
    warn.reason = message.join(' ')
    // Внесение предупреждения в базу
    const warnData = await db.setWarn(warn)
    console.log(warnData)
    await ctx.reply(`Иммун ${warnData.hash} ${warnData.firstname} ${warnData.secondname} (${warnData.faculty}) получил снижение иммунитета на ${warn.value}% по причине: ${warn.reason}`)
})
bot.command(`/infected`, async (ctx) => {
    console.log(ctx.message)
    let message = ctx.message.text.split(' ')
    if(message[1] != undefined) {
        let updValue = await db.setParameter('infected', message[1])
        await ctx.reply(`Обновлено. /status для просмотра текущих параметров.`)
    } else {
        await ctx.reply('Для обновления: /infected 54')
    }
})
bot.command(`/antidot`, async (ctx) => {
    console.log(ctx.message)
    let message = ctx.message.text.split(' ')
    if(message[1] != undefined) {
        let updValue = await db.setParameter('antidot', message[1])
        await ctx.reply(`Обновлено. /status для просмотра текущих параметров.`)
    } else {
        await ctx.reply('Для обновления: /antidot 54')
    }
})
bot.command(`/timer`, async (ctx) => {
    console.log(ctx.message)
    let message = ctx.message.text.split(' ')
    if(message[1] != undefined) {
        let updValue = await db.setParameter('timer', message[1])
        updValue ? await ctx.reply(`Обновлено. /status для просмотра текущих параметров.`) : await ctx.reply(`Что-то пошло не так :()`)
    } else {
        await ctx.reply('Для обновления: /timer 23:00')
    }
})


setTimeout(
    () => bot.launch(), 4000
)



module.exports = bot