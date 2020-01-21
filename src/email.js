import nodemailer from 'nodemailer'
// const settings = {
//     host: 'smtp.yandex.ru',
//     port: '465',
//     secure: true,
//     auth: {
//         user: 'podlesnykh_da@allservice.team',
//         pass: 'Diman222319',
//     }
// }
const settings = {
    host: 'smtp.yandex.ru',
    port: '465',
    secure: true,
    auth: {
        user: 'site@allservice.team',
        pass: 'TopSiteByTopPeople123',
    }
}

class Email {
    constructor() {
        this.transporter = nodemailer.createTransport(settings)
    }

    sendMessage(theme, data) {
        let html = ``
        if (theme == 'Новый мастер') {
            console.log('Мастер')
            html = this.createMasterHtml(data)
        }
        if (theme == 'Новая заявка') {
            console.log('Заявка')
            html = this.createRequestHtml(data)
        }
        console.log(html)
        let message = {
            from: 'Сайт ALLSERVICE <site@allservice.team>',
            // to: 'qunaxis@gmail.com',
            to: 'all@allservice.team',
            subject: `${theme} #${data.number}`,
            text: 'Откройте письмо в почтовом клиенте, поддерживающем HTML.',
            html: html,
        }
        try {
            this.transporter.sendMail(message)
        } catch(error) {
            console.log(error)
        }
    }

    createRequestHtml(data) {
        return `
            <table>
            <thead><tr>
                <th title="Field #2">Имя</th>
                <th title="Field #1">Телефон</th>
            </tr></thead>
            <tbody><tr>
                <td>${data.name}</td>                
                <td>${data.phone}</td>                
            </tr></tbody>
        </table>
        `
    }

    createMasterHtml(data) {
        return `
            <table>
            <thead><tr>
                <th title="Field #2">Фамилия</th>
                <th title="Field #1">Имя</th>
                <th title="Field #3">Отчество</th>
                <th title="Field #4">Серия пасп.</th>
                <th title="Field #5">Номер пасп.</th>
                <th title="Field #6">Дата рождения</th>
                <th title="Field #7">Email</th>
                <th title="Field #8">Телефон осн.</th>
                <th title="Field #9">Телефон доп.</th>
                <th title="Field #10">Сервисы</th>
                <th title="Field #11">Пароль</th>
                <th title="Field #13">Согл. конфиденциальность</th>
                <th title="Field #13">Согл. обр. данных</th>
                <th title="Field #13">Прин. оферту</th>
            </tr></thead>
            <tbody><tr>
                <td>${data.secondname}</td>
                <td>${data.firstname}</td>
                <td>${data.patronymic}</td>
                <td>${data.passSerial}</td>
                <td>${data.passNumber}</td>
                <td>${data.birth}</td>
                <td>${data.email}</td>
                <td>${data.phoneMain}</td>
                <td>${data.phoneAdditional}</td>                
                <td>${data.services}</td>                
                <td>${data.password}</td>              
                <td>${data.userAgreement}</td>                
                <td>${data.dataProcessed}</td>                
                <td>${data.offerAgreement}</td>                
                </tr></tbody>
            </table>
        `
    }
} 

const email = new Email

export default email


