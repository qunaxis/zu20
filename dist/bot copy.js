'use strict';

var _index = require('./models/index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Telegraf = require('telegraf');
const SocksAgent = require('socks5-https-client/lib/Agent');


const { BOT_TOKEN, PROXY_SOCKS5_HOST, PROXY_SOCKS5_PORT, PROXY_SOCKS5_USERNAME, PROXY_SOCKS5_PASSWORD, SECRET } = process.env;
// const socksAgent = new SocksAgent(`socks://${PROXY_SOCKS5_USERNAME}:${PROXY_SOCKS5_PASSWORD}@${PROXY_SOCKS5_HOST}:${PROXY_SOCKS5_PORT}`)
const socksAgent = new SocksAgent(`socks://${PROXY_SOCKS5_USERNAME}:${PROXY_SOCKS5_PASSWORD}@${SECRET}`);
//     socksPort: parseInt(PROXY_SOCKS5_PORT),
//     // If authorization is needed:
//     socksUsername: PROXY_SOCKS5_USERNAME,
//     socksPassword: PROXY_SOCKS5_PASSWORD
// })

// console.log(PROXY_SOCKS5_PASSWORD)
let bot = {};
// let antidot = 10
// let infected = 25
// let deadline = '23:00'
let chatId = 293233794;

const getStatus = async () => {
    const settingsArray = await _index2.default.Setting.findAll();
    let settings = {};
    if (settingsArray) {
        for (const setting of settingsArray) {
            settings[setting.dataValues.parameter] = setting.dataValues.value;
        }
    } else {
        console.log(new Error(settings));
    }
    console.log(settings);
    return settings;
};

const setWarn = async newWarn => {
    console.log(`SET WARN: ${newWarn.hash} ${newWarn.value} ${newWarn.reason}`);
    console.log(newWarn);
    const options = {
        fields: ['hash', 'value', 'reason', 'author']
    };

    const immun = await _index2.default.Immun.findOne({ where: {
            hash: newWarn.hash
        } });
    console.log(immun);
    const iHash = immun.dataValues.hash;
    const warn = await _index2.default.Warn.create({
        hash: iHash,
        value: newWarn.value,
        reason: newWarn.reason,
        author: newWarn.author
    }, options);
    const warnData = {
        hash: immun.dataValues.hash,
        secondname: immun.dataValues.secondname,
        firstname: immun.dataValues.firstname,
        faculty: immun.dataValues.faculty,
        value: warn.dataValues.value,
        reason: warn.dataValues.reason
    };
    return warnData;
};

// Нужно переопределить на уровне приложения!
const setParameter = async (newParameter, newValue) => {
    console.log(`SETTING PARAMETERS: ${newParameter}: ${newValue}`);
    const updatedSetting = await _index2.default.Setting.update({
        parameter: newParameter,
        value: newValue
    }, {
        where: {
            parameter: newParameter
        }
    });
    console.log(updatedSetting[0] == 1);
    return updatedSetting[0] == 1 ? true : false;
};

try {
    bot = new Telegraf(BOT_TOKEN, { agent: socksAgent });
    bot.telegram.sendMessage(chatId, 'Я перезагрузился и теперь активен. Жду Ваших приказаний, сэр!');
    console.log(`BOT IS ENABLED`);
} catch (error) {
    console.log(error);
}
bot.start(ctx => ctx.reply('Привет!\nЯ создан для обновления информации в профилях иммунов.\n\n/help - список команд'));
bot.help(ctx => ctx.reply('Команды:\n/status для получения текущего положения дел в мире\n/infected [%] - установить долю инфицированных\n/antidot [%] - установить % готовности антидота\n/timer [XX:XX] - установить время дедлайна'));
bot.command(`/infected`, async ctx => {
    console.log(ctx.message);
    let message = ctx.message.text.split(' ');
    if (message[1] != undefined) {
        let updValue = await setParameter('infected', message[1]);
        ctx.reply(`Обновлено. Инфицированных: ${updValue}%`);
    } else {
        ctx.reply('Для обновления: /infected 54');
    }
});
bot.command(`/antidot`, async ctx => {
    console.log(ctx.message);
    let message = ctx.message.text.split(' ');
    if (message[1] != undefined) {
        let updValue = await setParameter('infected', message[1]);
        ctx.reply(`Обновлено. Готовность антидота: ${updValue}%`);
    } else {
        ctx.reply('Для обновления: /antidot 54');
    }
});
bot.command(`/timer`, async ctx => {
    console.log(ctx.message);
    let message = ctx.message.text.split(' ');
    if (message[1] != undefined) {
        let updValue = await setParameter('timer', message[1]);
        updValue ? ctx.reply(`Обновлено. Таймер до: ${updValue}`) : ctx.reply(`Что-то пошло не так :()`);
    } else {
        ctx.reply('Для обновления: /timer 23:00');
    }
});
bot.command(`/warn`, async ctx => {
    let message = ctx.message.text.split(' ');
    console.log(ctx.from);
    let warn = {
        hash: message[1],
        value: parseInt(message[2]),
        author: ctx.from.username
    };
    message.shift();
    message.shift();
    message.shift();
    warn.reason = message.join(' ');
    // Внесение предупреждения в базу
    const warnData = await setWarn(warn);
    console.log(warnData);
    ctx.reply(`Иммун ${warnData.hash} ${warnData.firstname} ${warnData.secondname} (${warnData.faculty}) получил снижение иммунитета на ${warn.value}% по причине: ${warn.reason}`);
});
bot.command(`/status`, async ctx => {
    // const status = await getStatus()
    // console.log(status)
    const { antidot, infected, deadline } = await getStatus();
    ctx.reply(`Прогресс разработки антидота: ${antidot}%\nДоля зараженных: ${infected}%\nВремя таймера: ${deadline}`);
});
bot.on('sticker', ctx => ctx.reply('👍'));
bot.hears('Позя лучший!', ctx => ctx.reply('Да пошёл ты))'));
bot.launch();

module.exports = bot;
//# sourceMappingURL=bot copy.js.map