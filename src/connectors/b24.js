import Bitrix, { Method } from '@2bad/bitrix'
import { METHODS } from 'http'
 
const { PORTAL_NAME, ACCESS_TOKEN, WEBHOOK_TOKEN } = process.env 

// Connect to Bitrix24 through OAuth 2.0
const connectToBitrix = () => {
    let bitrixConnection = {}
    try {
        // bitrixConnection = Bitrix(`https://${PORTAL_NAME}.bitrix24.ru/rest`, ACCESS_TOKEN)
        bitrixConnection = Bitrix(`https://${PORTAL_NAME}.bitrix24.ru/rest/1/${WEBHOOK_TOKEN}`)
        
        console.log(`[CONNECTORS] Bitrix24 has been connected`)
        return bitrixConnection
    } catch (error) {
        console.log(`[CONNECTORS] Bitrix24 connection error:`)
        console.error(error)
    }
}

let bitrix = connectToBitrix()

// console.log(bitrix)

// Get all deals
bitrix.getDealList = async () => {
    console.log(bitrix.deals)
    // const bitrixRespond = await bitrix.deals.list({ select: ["*", "UF_*"] })
    const bitrixRespond = await bitrix.deals.list({ select: ["*", "UF_*"] })
    const { result } = bitrixRespond
    console.log(result)
    // console.log(bitrixRespond)
    // result.map((el) => console.log(el.TITLE))
    return result
    // .then(({ result }) => {
    //     const titles = result.map((e) => e.TITLE)
    //     console.log(titles)
    //     })
    //     .catch(console.error)
}

// Get deal information by deal id
bitrix.getDealById = async (dealId) => {
    const bitrixRespond = await bitrix.deals.get(dealId)
    const { result } = bitrixRespond
    console.log(result)
    return result
}

// Update deal information by deal id
bitrix.updateDealById = async (dealId, rawData) => {
    const data = rawData.map(el => {
        // Preparing data fields for B24
        return el
    })
    // Now it can update status of deal
    const bitrixRespond = await bitrix.deals.update(dealId, {
        STAGE_ID: data.STAGE_ID,
        // TITLE: data.TITLE
    })
    // const bitrixRespond = await bitrix.deals.update(dealId, {
    //     STAGE_ID: data.STAGE_ID,
    //     TITLE: data.TITLE
    // })
    const { result } = bitrixRespond
    console.log(result)
    return result
}

// Create master contact from site registration (ASDB -> B24 sync)
bitrix.createMasterContact = async (rawData) => {
    // const bitrixRespond = await bitrix.deals.get(dealId)
    // const { result } = bitrixRespond
    // const result = 'bitrix.createMasterContact'
    const bitrixData = {
        fields: {
            TYPE_ID: 'PARTNER', // Type of contacts; МАСТЕР
            NAME: rawData.firstname,
            LAST_NAME: rawData.secondname,
            SECOND_NAME: rawData.patronymic,
            BIRTHDATE: rawData.birth,
            PHONE: [
                { 'VALUE': rawData.phoneMain, TYPE: 'WORK' },
                { 'VALUE': rawData.phoneAdditional, TYPE: 'MOBILE' }
            ],
            EMAIL: rawData.email,
            UF_CRM_1568983591: rawData.services, // Services description by master
            UF_CRM_1568983636: rawData.passSerial,
            UF_CRM_1568983691: rawData.passNumber,
            UF_CRM_1569360417: rawData.id, // ASDB ID
            ASSIGNED_BY_ID: 17 // Assign sell manager (!) need to automatization
        },
        params: {}
    }



    const bitrixRespond = await bitrix.call(Method.CRM_CONTACT_ADD, bitrixData)
    const { result } = bitrixRespond

    // Notify admin about new master registration
    bitrix.notify(`Мастер #${result} ${rawData.firstname} ${rawData.secondname} зарегистрирован!`)
    return result
}

// Get all users
bitrix.getUserList = async () => {
    const bitrixRespond = await bitrix.call('user.get', {}) // {} - search params
    const { result } = bitrixRespond
    console.log(result)
    // return result
}

// Get all contacts
bitrix.getContactList = async () => {
    const bitrixRespond = await bitrix.call('crm.contact.list', {}) // {} - search params
    const { result } = bitrixRespond
    console.log(result)
    // return result
}

// Send notify to admin
bitrix.notify = async message => {
    const notify = await bitrix.call('im.notify', {
        USER_ID: 1,
        type: 'SYSTEM',
        message: message
    })
    console.log(notify)
}

// console.log(bitrix.getUserList())
// console.log(bitrix.getContactList())


module.exports = bitrix