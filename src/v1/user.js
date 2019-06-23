import { Router } from 'express'
import db from '../models/index'

import email from '../email'

// db.sequelize.authenticate()
//     .then(() => {
//         console.log('Connection has been established successfully.')
//     })
//     .catch(err => {
//         console.error('Unable to connect to the database:', err)
//     })

// db.User.create({
//     username: 'HUY'
// })

const user = Router()


user.post('/signup', async (req, res) => {
    // let rawData = {}
    const clientData = req.body
    
    let userData = {
        firstname: clientData.about.firstname,
        secondname: clientData.about.secondname,
        patronymic: clientData.about.patronymic || null,
        passSerial: clientData.about.passSerial,
        passNumber: clientData.about.passNumber,
        birth: clientData.about.birth,
        email: clientData.contacts.email || null,
        phoneMain: clientData.contacts.phoneMain,
        phoneAdditional: clientData.contacts.phoneAdditional || null,
        services: clientData.services || null,
        password: clientData.finish.password,
        passwordConfirm: clientData.finish.passwordConfirm,
        userAgreement: clientData.finish.userAgreement,
        passwordConfirm: clientData.finish.dataProcessed
    }
    console.log(userData)
    try {
        const result = await db.User.create(userData)
        result ? email.sendMessage('Новый мастер', result.dataValues) : null
        res.json({ status: 'ok' })
    } catch(error) {
        console.log(error)
        res.json({
            status: 'error',
            error: error
        })
    }
})


export default user