import { Router } from 'express'
import db from '../models/index'
import bitrix from '../connectors/b24'

import email from '../email'

const user = Router()

user.post('/deals', async (req, res) => {
    console.log('GETTING DEAL LIST')
    const data = await bitrix.getDealList()
    res.send(data)
})
user.post('/deal', async (req, res) => {
    const { dealId } = req.body
    console.log('GETTING DEAL ' + dealId)
    const data = await bitrix.getDealById(dealId)
    res.send(data)
})

// Now it can update only stage status
user.patch('/deal', async (req, res) => {
    const { dealId, dealData } = req.body
    // dev data
    const devDealData = {
        // STAGE_ID: 'C4:4',
        TITLE: 'UPD. API TEST'
    }
    // console.log('GETTING DEAL ' + dealId)
    const data = await bitrix.updateDealById(dealId, devDealData) // Change devDealData => dealData
    res.send(data)
})

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
    // console.log(userData)
    let asdbUser = {}
    try {
        asdbUser = await db.User.create(userData)
        asdbUser ? email.sendMessage('Новый мастер', asdbUser.dataValues) : null
        // console.log(asdbUser)
    } catch(error) {
        console.log(error)
        res.json({
            status: 'db_error',
            error: error
        })
    }



    // console.log('CREATING MASTER')
    // Create master contant in B24
    let userBitrixId = ''
    try {
        userBitrixId = await bitrix.createMasterContact(asdbUser.dataValues) // maybe asdbuser? for send asdbId to b24
    } catch(error) {
        console.log(error)
        const errorMessage = `Ошибка создания контакта мастера ${userData.firstname} ${userData.secondname} в Битриксе. #BR# ID: ${asdb.dataValues.id}`
        bitrix.notify(errorMessage)
        res.json({
            status: 'b24_error',
            errorMessage: errorMessage,
            error: error
        })
    }


    // Update master data in ASDB
    console.log(asdbUser)
    try {
        console.log('BITRIX ID ' + userBitrixId)
        const result = await asdbUser.update(
            { bitrixContactId: userBitrixId },
            // { where: { id: asdbUser.dataValues.id } }        
        )
        console.log(result)
        // result ? email.sendMessage('Новый мастер', result.dataValues) : null
    } catch(error) {
        console.log(error)
        const errorMessage = `Ошибка занесения bitrixId ${userBitrixId} мастера ${userData.firstname} ${userData.secondname} в ASDB. #BR# ID: ${asdb.dataValues.id}`
        bitrix.notify(errorMessage)
        res.json({
            status: 'db_error',
            error: error
        })
    }

    res.json({ status: 'ok' })
})


export default user