let fs        = require('fs')
let path      = require('path')
let Sequelize = require('sequelize')
const csv = require('csvtojson')
import { RandomHash } from 'random-hash'
import { randomBytes } from 'crypto'
import QRCode from 'qrcode-svg'
import ObjectsToCsv from 'objects-to-csv'
import archiver from 'archiver'
import rimraf from 'rimraf'


const { FIRST_START, NODE_ENV, DATABASE_URL, DEFAULT_IMMUNITET } = process.env
// const domain = `zu20.ru`    
const domain = `zu20.herokuapp.com`
// const domainTop = `zu20.ru`
let basename  = path.basename(__filename)


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
    if (FIRST_START === 'TRUE') {
        await db.sequelize.sync({ force: true })
    } else {
        await db.sequelize.sync()
    }
}

// console.log(toString('huy').toUpperCase())

const importCsv = async () => {
    let data = {}
    let csvOptions = {}
    let csvPath = ''
    if (FIRST_START === 'TRUE') {
        console.log('hahahaha');
        
        csvOptions= {
            delimiter: ';',
            noheader: true,
            headers: [ 'id', 'secondname', 'firstname', 'patronymic', 'birth', 'faculty', 'group', 'phone', 'organization', 'hash', 'url' ]
        }
        csvPath = path.join(__dirname, '../../docs/users.csv')
    } else {
        csvOptions = {
            delimiter: ',',
            // noheader: true
        }
        csvPath = path.join(__dirname, '../../docs/hash.csv')
    }
    try {
        data = await csv(csvOptions).fromFile(csvPath)
        // console.log(data)
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
        item.url = `${domain}/${item.hash}`
        hashedData.push(item)
    }
    return hashedData
}

const genQrs = async (data) => {
    let urlData = []
    fs.mkdir(path.join(__dirname, `../../docs/qrs/`), () => console.log('Пака создана'))
    for (let item of data) {
        // console.log(item)
        let qr = new QRCode({
            content: item.url,
            join: true,
            padding: 7,
            width: 170,
            height: 170,
            color: "#000000",
            background: "#ffffff",
            ecl: "M",
        })
        // const qrPath = path.join(__dirname, `../../docs/qrs/`)
        // fs.rmdirSync(qrPath, { recursive: true })
          // fs.rmdirSync(qrPath, { recursive: true })
        // await rimraf(qrPath, {
            //   maxBusyTries: 100
        // }, () => console.log('OK'))  
        // await fs.mkdir(qrPath)
        qr.save(path.join(__dirname, `../../docs/qrs/${item.id + ' ' + item.secondname + ' ' + item.firstname}.svg`))
        urlData.push(item)
    }
    return urlData
}

const createQrZip = async () => {
    const zipPath = path.join(__dirname, `../../docs/QRs.zip`)
    let output = fs.createWriteStream(zipPath)    
    let archive = archiver('zip', {
        zlib: { level: 9 } // Sets the compression level.
    })
    archive.pipe(output)
    archive.directory(path.join(__dirname, `../../docs/qrs`), false)
    archive.finalize()
    return 'YEEEEEEES' 
}

const saveUrlCsv = async (urlData) => {
    const csv = new ObjectsToCsv(urlData)
    csv.toDisk(path.join(__dirname, `../../docs/hash.csv`))    
    return true  
}

const importDataToDb = async (data) => {
    let resultImmun = await db.Immun.bulkCreate(data, {
        fields: ['id','secondname', 'firstname', 'patronymic', 'birth', 'faculty', 'group', 'phone', 'organization', 'hash']
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

    const immun = await db.sequelize.query(`SELECT "hash", SUM("value") as "immunitet" FROM "Warns" AS "Warn" WHERE "Warn"."hash" = $hash GROUP BY "hash"`, {
        bind: {
            hash: immunHash
        }
    })
    console.log(immun)

    let result = []
    if (immun[1].rowCount > 0) { // Если варны есть
        if (immun[0][0].immunitet > 100) {
            result = 0
        } if (immun[0][0].immunitet > 0) {
            result = 100 - immun[0][0].immunitet
        } else {
            result = DEFAULT_IMMUNITET
        }
    } else {
        result = DEFAULT_IMMUNITET
    }
    return result
}

db.getWarnsData = async () => {
    let result = {}
    try {
        const data = await db.Warn.findAll({
            include: [{
              model: db.Immun,
              as: 'Immun' // specifies how we want to be able to access our joined rows on the returned data
            }]
        })
        console.log(data)
        result = data.dataValues
    } catch (error) {
        console.log(error)
    }
    return result
}


db.getAvgImmunitet = async () => {
    
    // const immun = await db.sequelize.query(`
    //     SELECT 
    //         AVG("im.immunitet") as "im.immunitet" 
    //     FROM (
    //         SELECT
    //             "hash", SUM("value") as "immunitet" 
    //         FROM "Warns" AS "Warn"
    //         GROUP BY "hash"
    //     ) AS "im"`
    // )
    const immun = await db.sequelize.query(`
        SELECT
            "hash", SUM("value") as "immunitet" 
        FROM "Warns" AS "Warn"
            GROUP BY "hash"
        ) AS "im"`
    )
    console.log(immun)

    let result = []
    if (immun[1].rowCount > 0) { // Если варны есть
        if (immun[0][0].immunitet > 100) {
            result = 0
        } if (immun[0][0].immunitet > 0) {
            result = 100 - immun[0][0].immunitet
        } else {
            result = 100
        }
    } else {
        result = 100
    }
    return result
}

(async () => {
    await syncDb()
    console.log('\n\n\n\n\n\n\n' + FIRST_START)
    
    // await db.getWarnsData()

    let finalData = {}
    let csvData = {}
    csvData = await importCsv()
    if(FIRST_START === 'TRUE') {
        csvData = await prepareData(csvData)
        const csvStatus = saveUrlCsv(csvData) 
        console.log(csvStatus)      /* --- GOOD --- */
        const importedData = await importDataToDb(csvData)
        // const status = await db.getStatus()
        // console.log(status) /* --- GOOD --- */
    }
    // console.log(preparedData) /* --- GOOD --- */
    // console.log(csvData)     /* --- GOOD --- */
    const qrStatus = await genQrs(csvData)
    console.log(qrStatus)     /* --- GOOD --- */
    const qrsAnswer = await createQrZip()
    console.log(qrsAnswer)
    // const warn = await db.setWarn({ 
        //     hash: '9T9Z2A',
        //     value: 12,
        //     reason: 'HUY',
        //     author: 'qunaxis'
        // })
    // console.log(warn) /* --- GOOD --- */
    // const set = await db.setParameter('timer', '22:00')
    // const set = await db.setParameter('timer', '22:00')
    // console.log(set) /* --- GOOD --- */


    // console.log(importedData[0]) /* --- GOOD --- */
    // console.log(importedData[1]) /* --- GOOD --- */
})()



module.exports = db
