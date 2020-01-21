let fs        = require('fs')
let path      = require('path')
let Sequelize = require('sequelize')
let basename  = path.basename(__filename)
import archiver from 'archiver'

import csvParser from 'csv-parser'
// import fs from 'fs'
import { RandomHash } from 'random-hash'
import { randomBytes } from 'crypto'
import QRCode from 'qrcode-svg'
import ObjectsToCsv from 'objects-to-csv'
// let env       = process.env.NODE_ENV || 'development'
// let config    = require(__dirname + '/../config/config.js')[env]
let db        = {}

const { FIRST_START, NODE_ENV, DATABASE_URL, GEN } = process.env

// let sequelize = {}
let sequelize = {}

// try {
//   sequelize = new Sequelize('ddqm2qob8uuafq', 'wsmaenfpkiucys', '4e8affb41d403392103d8ea5a3da99bec8c0ef02780d9c8f2bc8c2e3d14933f3', {
//     host: 'ec2-79-125-126-205.eu-west-1.compute.amazonaws.com',
//     port: '5432',
//     dialect: 'postgres',
//     dialectOptions: {
//       ssl: true
//     }
//   })
//   console.log(`DB HAS BEEN CONNECTED`)
// } catch(error) {
//   console.error(error)
// }

// console.log(sequelize)

if (NODE_ENV == 'production') {
	try {
    sequelize = new Sequelize(DATABASE_URL)
    console.log(`PROD DB HAS BEEN CONNECTED`)
	} catch(error) {
		console.error(error)
	}	
} else {
	sequelize = new Sequelize('postgres://eoqhwdwukbgmrn:5be8554312f708989cf69b4f001b6a7fc666321d8566d4d23c09e39034d8b6d3@ec2-46-51-190-87.eu-west-1.compute.amazonaws.com:5432/d5teem0o06p85b')
try {
  sequelize = new Sequelize('d5teem0o06p85b', 'eoqhwdwukbgmrn', '5be8554312f708989cf69b4f001b6a7fc666321d8566d4d23c09e39034d8b6d3', {
    host: 'ec2-46-51-190-87.eu-west-1.compute.amazonaws.com',
    port: '5432',
    dialect: 'postgres',
    dialectOptions: {
      ssl: true
    }
  })
  console.log(`TEST DB HAS BEEN CONNECTED`)
} catch(error) {
  console.error(error)
}
}

// const sequelize = new Sequelize(DATABASE_URL)
// const sequelize = new Sequelize('as', 'qunaxis', 'Diman222319', {
//   host: 'rc1b-3to2wlk3cs3kkt0a.mdb.yandexcloud.net',
//   port: 6432,
//   dialect: 'postgres',
//   dialectOptions: {
//     ssl: true
//   }
// })

// if (config.use_env_variable) {
//   let sequelize = new Sequelize(process.env[config.use_env_variable], config)
// } else {
//   let sequelize = new Sequelize(config.database, config.username, config.password, config)
// }
sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.')
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err)
    })

fs
	.readdirSync(__dirname)
	.filter(file => {
		return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js')
	})
	.forEach(file => {
		let model = sequelize['import'](path.join(__dirname, file))
		db[model.name] = model
	})

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

let genHash = new RandomHash({
  length: 6,
  charset: 'ABCDEFGHKLMNPQRSTUVXYZ0123456789',
  rng: randomBytes
})
let usersData = []
Date.prototype.isValid = function () {
  // An invalid date object returns NaN for getTime() and NaN is the only
  // object not strictly equal to itself.
  return this.getTime() === this.getTime();
};  

if(FIRST_START) {
  if (GEN) {
    fs.createReadStream(path.join(__dirname, '../../docs/users.csv'))
    .pipe(csvParser({
      separator: ';',
      headers: ['id', 'secondname', 'firstname', 'patronymic', 'birth', 'faculty', 'group', 'phone', 'organization' ]
    }))
    .on('data', (data) => {
      data.id = parseInt(data.id)
      data.hash = genHash()
      console.log(data.hash)
      let qr = new QRCode({
        content: `zu20.herokuapp.com/${data.hash}`,
        join: true,
        padding: 4,
        width: 256,
        height: 256,
        color: "#000000",
        background: "#ffffff",
        ecl: "M",
      })
      qr.save(path.join(__dirname, `../../docs/qr/${data.id + ' ' + data.secondname + ' ' + data.firstname}.svg`))
      data.birth = new Date(data.birth.split('.').reverse().join('/'))
      usersData.push(data)
    })
    .on('end', () => {
      (async () => {
        let urlData = []
        
        usersData.forEach(item => {
          item.url = `zu20.herokuapp.com/${item.hash}`
          urlData.push(item)
        })

        let output = fs.createWriteStream(path.join(__dirname, `../../docs/QRs.zip`));
        let archive = archiver('zip', {
          zlib: { level: 9 } // Sets the compression level.
        })
        archive.pipe(output)
        archive.directory(path.join(__dirname, `../../docs/qr`), false)
        archive.finalize()
        const csv = new ObjectsToCsv(urlData)
        // Save to file:
        await csv.toDisk(path.join(__dirname, `../../docs/hash.csv`))       
        // Return the CSV file as string:
        // console.log(await csv.toString());
      })();
    })
  } else {
    fs.createReadStream(path.join(__dirname, '../../docs/users.csv'))
    .pipe(csvParser({
      separator: ';',
      headers: ['id', 'secondname', 'firstname', 'patronymic', 'birth', 'faculty', 'group', 'phone', 'organization', 'hash' ]
    }))
    .on('data', (data) => {
      data.id = parseInt(data.id)
      usersData.push(data)
    })
    .on('end', () => {
      
    })
  }

    let importToDb = async () => {
      let resultImmun = await db.Immun.bulkCreate(usersData, {
        fields: ['id', 'secondname', 'firstname', 'patronymic', 'birth', 'faculty', 'group', 'phone', 'organization', 'hash']
      })
      let resultSetting = await db.Setting.bulkCreate(
        [
          {
            parameter: 'infected',
            value: '0'
          },
          {
            parameter: 'timer',
            value: '15:00'
          },
          {
            parameter: 'antidot',
            value: '0'
          }
        ], {
          fields: ['parameter', 'value']
        })
      // console.log(result)
    } 
    
    setTimeout(importToDb, 4000)
    setTimeout(() => {
      if (FIRST_START) {
        db.sequelize.sync({ force: true })
      } else {
        db.sequelize.sync()
      }
    }, 3000)
    
    setTimeout(() => {
      db.User.hasMany(db.Warn, {
        foreignKey: 'hash'
      })
      db.Warn.belongsTo(db.User)
    }, 2000)  
}



db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db