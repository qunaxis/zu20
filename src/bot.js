const Telegraf  = require('telegraf')
const SocksAgent = require('socks5-https-client/lib/Agent')
import db from './models/index'

const { BOT_TOKEN, PROXY_SOCKS5_HOST, PROXY_SOCKS5_PORT, PROXY_SOCKS5_USERNAME, PROXY_SOCKS5_PASSWORD, SECRET } = process.env
// const socksAgent = new SocksAgent(`socks://${PROXY_SOCKS5_USERNAME}:${PROXY_SOCKS5_PASSWORD}@${PROXY_SOCKS5_HOST}:${PROXY_SOCKS5_PORT}`)
const socksAgent = new SocksAgent(`socks://${PROXY_SOCKS5_USERNAME}:${PROXY_SOCKS5_PASSWORD}@${SECRET}`)
//     socksPort: parseInt(PROXY_SOCKS5_PORT),
//     // If authorization is needed:
//     socksUsername: PROXY_SOCKS5_USERNAME,
//     socksPassword: PROXY_SOCKS5_PASSWORD
// })

// console.log(PROXY_SOCKS5_PASSWORD)
let bot = {}
// let antidot = 10
// let infected = 25
// let deadline = '23:00'
let chatId = 293233794


try {
    bot = new Telegraf(BOT_TOKEN, { agent: socksAgent })
    bot.telegram.sendMessage(chatId, 'Я перезагрузился и теперь активен. Жду Ваших приказаний, сэр!')
    console.log(`BOT IS ENABLED`)
} catch(error) {
    console.log(error)
}
bot.start((ctx) => ctx.reply('Привет!\nЯ создан для обновления информации в профилях иммунов.\n\n/help - список команд'))
bot.help((ctx) => ctx.reply('Команды:\n/status для получения текущего положения дел в мире\n/infected [%] - установить долю инфицированных\n/antidot [%] - установить % готовности антидота\n/timer [XX:XX] - установить время дедлайна'))
bot.command(`/infected`, (ctx) => {
    console.log(ctx.message)
    let message = ctx.message.text.split(' ')
    if(message[1] != undefined) {
        let updValue = setParameter('infected', message[1])
        ctx.reply(`Обновлено. Инфицированных: ${updValue}%`)
    } else {
        ctx.reply('Для обновления: /infected 54')
    }
})
bot.command(`/antidot`, (ctx) => {
    console.log(ctx.message)
    let message = ctx.message.text.split(' ')
    if(message[1] != undefined) {
        let updValue = setParameter('infected', message[1])
        ctx.reply(`Обновлено. Готовность антидота: ${updValue}%`)
    } else {
        ctx.reply('Для обновления: /antidot 54')
    }
})
bot.command(`/timer`, (ctx) => {
    console.log(ctx.message)
    let message = ctx.message.text.split(' ')
    if(message[1] != undefined) {
        let updValue = setParameter('timer', message[1])
        ctx.reply(`Обновлено. Таймер до: ${updValue}`)
    } else {
        ctx.reply('Для обновления: /timer 23:00')
    }
})
bot.command(`/warn`, ctx => {
    let message = ctx.message.text.split(' ')
    console.log(ctx.from)
    let warn = {
        hash: message[1],
        value: parseInt(message[2])
    }
    warn.author = ctx.from.username
    message.shift()
    message.shift()
    message.shift()
    warn.reason = message.join(' ')
    // Внесение предупреждения в базу
    const warnData = setWarn(warn)
    console.log(warnData)
    ctx.reply(`Иммун ${warnData.hash} ${warnData.firstname} ${warnData.secondname} (${warnData.faculty}) получил снижение иммунитета на ${warn.value}% по причине: ${warn.reason}`)
})
bot.command(`/status`, async (ctx) => {
    const { antidot, infected, deadline } = getStatus()
    ctx.reply(`Прогресс разработки антидота: ${antidot}%\nДоля зараженных: ${infected}%\nВремя таймера: ${deadline}`)
})
bot.on('sticker', (ctx) => ctx.reply('👍'))
bot.hears('Позя лучший!', (ctx) => ctx.reply('Да пошёл ты))'))
bot.launch()
// Нужно переопределить на уровне приложения!
const setParameter = (newParameter, newValue) => {
    console.log(`SETTING PARAMETERS: ${newParameter}: ${newValue}`)
    (async() => {
        await db.Setting.update({
            parameter: newParameter,
            value: newValue
        }, {
            where: {
                parameter: newParameter
            }
        })
    })()
    console.log(newValue)
    return newValue
}


const getStatus = async() => {
    const settings = await db.Setting.findAll()
    if(settings) { 
        console.log(settings.dataValues)
    } else { 
        return Promise.reject() 
    }
    return Promise.resolve(settings)
}

// ДОПИСАТЬbn
const setWarn = async (newWarn) => {
    console.log(`SET WARN: ${newWarn.hash} ${newWarn.value} ${newWarn.reason}`)
    console.log(newWarn)
    const options = {
        fields: ['hash', 'value', 'reason', 'author'] 
    }

    const immun = await db.Immun.findOne({ where: {
        hash: newWarn.hash
    }})
    console.log(immun)
    const iHash = immun.dataValues.hash
    const warn = await db.Warn.create({
        hash: iHash,
        value: newWarn.value,
        reason: newWarn.reason,
        author: newWarn.author
    }, options)


    const warnData = {
        secondname: immun.dataValues.secondname,
        firstname: immun.dataValues.firstname,
        faculty: immun.dataValues.faculty,
        ...warn.dataValues
    }

    // const userWarn = await user.addWarn(warn)

    // console.log(userWarn)

    // let warn = await db.Health.create({
    //     hash: newWarn.hash,
    //     value: newWarn.value,
    //     reason: newWarn.reason,
    //     author: newWarn.author
    // }, options)
    // let warn = await db.Warn.create({
    //     hash: 'VDS431',
    //     value: 34,
    //     reason: 'Обблевался',
    //     author: 'qunaxis'
    // }, options)
    // let warn = db.Warn.create({
    //     hash: newWarn.hash,
    //     value: newWarn.value,
    //     reason: newWarn.reason,
    //     author: newWarn.author
    // }, options)

    // await db.User.addWarn(

    // )

    // const { hash, value, reason, author } = newWarn
    
    // newWarn.createdAt = new Date()
    // newWarn.updatedAt = new Date()
    // console.log(newWarn)
    // let warn = await db.sequelize.query(`INSERT INTO "Warns"("hash", "value", "reason", "author", "createdAt", "updatedAt") VALUES ($hash, $value, $reason, $author, $createdAt, $updatedAt)`, {
    //     bind: newWarn
    // })


    // console.log(warn)
    return warnData
}

module.exports = bot