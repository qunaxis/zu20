let fs        = require('fs')
let path      = require('path')
let Sequelize = require('sequelize')
const csv = require('csvtojson')
import { RandomHash } from 'random-hash'
import { randomBytes } from 'crypto'
import QRCode from 'qrcode-svg'
import ObjectsToCsv from 'objects-to-csv'



const { FIRST_START, NODE_ENV, DATABASE_URL } = process.env
const domain = `zu20.herokuapp.com`
let basename  = path.basename(__filename)
const csvPath = path.join(__dirname, '../../docs/users.csv')


let db = {}
let sequelize = {}

try {
    if (NODE_ENV == 'production') {
        sequelize = new Sequelize(DATABASE_URL)
    } else {
        sequelize = new Sequelize('d5teem0o06p85b', 'eoqhwdwukbgmrn', '5be8554312f708989cf69b4f001b6a7fc666321d8566d4d23c09e39034d8b6d3', {
            host: 'ec2-46-51-190-87.eu-west-1.compute.amazonaws.com',
            port: '5432',
            dialect: 'postgres',
            dialectOptions: {
              ssl: true
            }
        })
    }
} catch(error) {
    console.error(error)
}

try {
    sequelize.authenticate()
} catch (error) {
    console.error('Unable to connect to the database:', error)
}

fs
	.readdirSync(__dirname)
	.filter(file => {
		return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js')
	})
	.forEach(file => {
		let model = sequelize['import'](path.join(__dirname, file))
		db[model.name] = model
    })

db.sequelize = sequelize
db.Sequelize = Sequelize

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db)
    }
})

const syncDb = async () => {
    if (FIRST_START) {
        await db.sequelize.sync({ force: true })
    } else {
        await db.sequelize.sync()
    }
}


const importCsv = async (csvPath) => {
    let data = {}
    const csvOptions = {
        delimiter: ';',
        noheader: true,
        headers: [ 'id', 'secondname', 'firstname', 'patronymic', 'birth', 'faculty', 'group', 'phone', 'organization', 'hash', 'url' ]
    }
    try {
        data = await csv(csvOptions).fromFile(csvPath)
        return data
    } catch (error) {
        throw new Error(error)
    }    
}

const genHash = new RandomHash({
    length: 6,
    charset: 'ABCDEFGHKLMNPQRSTUVXYZ0123456789',
    rng: randomBytes
})

const prepareData = async (data) => {
    let hashedData = []
    for (let item of data) {
        item.hash = genHash()
        item.birth = new Date(item.birth.split('.').reverse().join('/'))
        hashedData.push(item)
    }
    return hashedData
}

const genQrs = async (data) => {
    let urlData = []
    for (let item of data) {
        item.url = `${domain}/${item.hash}`
        let qr = new QRCode({
            content: item.url,
            join: true,
            padding: 4,
            width: 256,
            height: 256,
            color: "#000000",
            background: "#ffffff",
            ecl: "M",
          })
        qr.save(path.join(__dirname, `../../docs/qrs/${item.id + ' ' + item.secondname + ' ' + item.firstname}.svg`))
        
        urlData.push(item)
    }
    return urlData
}

const saveUrlCsv = async (urlData) => {
    const csv = new ObjectsToCsv(urlData)
    csv.toDisk(path.join(__dirname, `../../docs/hash.csv`))
    return true  
}

const importDataToDb = async (data) => {
    let resultImmun = await db.Immun.bulkCreate(data, {
        fields: ['secondname', 'firstname', 'patronymic', 'birth', 'faculty', 'group', 'phone', 'organization', 'hash']
    })
      // resultImmun ? console.log("IMMUNS DATA HAS BEEN IMPORTED") : reject(new Error('ERROR IN IMMUNS DATA IMPORT'))
    resultImmun ? resultImmun : new Error(resultImmun)
    let resultSettings = await db.Setting.bulkCreate(
        [
            { parameter: 'infected', value: '0' },
            { parameter: 'timer', value: '15:00' },
            { parameter: 'antidot', value: '0' }
        ], {
            fields: ['parameter', 'value']
        })
    resultSettings ? console.log("SETTINGS DEFAULTS HAS BEEN SETTING") : new Error(resultSettings)
    return [resultImmun, resultSettings]
}

db.getStatus = async () => {
    const settingsArray = await db.Setting.findAll()
    let settings = {}
    if(settingsArray) { 
        for (const setting of settingsArray) {
            settings[setting.dataValues.parameter] = setting.dataValues.value
        }
    } else { 
        console.log(new Error(settings))
    }
    console.log(settings)
    return settings
}

db.setWarn = async (newWarn) => {
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
        hash: immun.dataValues.hash,
        secondname: immun.dataValues.secondname,
        firstname: immun.dataValues.firstname,
        faculty: immun.dataValues.faculty,
        value: warn.dataValues.value,
        reason: warn.dataValues.reason
    }
    return warnData
}

// Нужно переопределить на уровне приложения!
db.setParameter = async (newParameter, newValue) => {
    console.log(`SETTING PARAMETERS: ${newParameter}: ${newValue}`)
    const updatedSetting = await db.Setting.update({
            parameter: newParameter,
            value: newValue
        }, {
            where: {
                parameter: newParameter
            }
        })
    console.log(updatedSetting[0] == 1)
    return updatedSetting[0] == 1 ? true : false
}

db.getImmunitet = async (immunHash) => {
    const immun = db.Warn.findAll({
        where: {
            hash: immunHash
        },
        group: ['hash'],
        attributes: [
            'hash',
            db.sequelize.fn('SUM', db.sequelize.col('value'))
        ],
    })
    console.log(immun)
    return 100
}

(async () => {
    await syncDb()
    if(FIRST_START) {
        const csvData = await importCsv(csvPath)
        // console.log(csvData)     /* --- GOOD --- */
        const preparedData = await prepareData(csvData)
        // console.log(preparedData) /* --- GOOD --- */
        const urlData = await genQrs(preparedData)
        // console.log(urlData)     /* --- GOOD --- */
        const csvStatus = saveUrlCsv(urlData) 
        console.log(csvStatus)      /* --- GOOD --- */
        const importedData = await importDataToDb(urlData)
        // const status = await db.getStatus()
        // console.log(status) /* --- GOOD --- */
    }
    // const warn = await db.setWarn({ 
        //     hash: '9T9Z2A',
        //     value: 12,
        //     reason: 'HUY',
        //     author: 'qunaxis'
        // })
    // console.log(warn) /* --- GOOD --- */
    // const set = await db.setParameter('timer', '22:00')
    // console.log(set) /* --- GOOD --- */


    // console.log(importedData[0]) /* --- GOOD --- */
    // console.log(importedData[1]) /* --- GOOD --- */
})()



module.exports = db
