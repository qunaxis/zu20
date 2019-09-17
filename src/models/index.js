let fs        = require('fs')
let path      = require('path')
let Sequelize = require('sequelize')
let basename  = path.basename(__filename)
// let env       = process.env.NODE_ENV || 'development'
// let config    = require(__dirname + '/../config/config.js')[env]
let db        = {}

const { FIRST_START, NODE_ENV, DEV_DB_URI, DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_BASE, DB_SSL } = process.env

// let sequelize = {}
let sequelize = {}

if (NODE_ENV == 'production') {
	try {
    sequelize = new Sequelize('as', 'qunaxis', 'Diman222319', {
      host: 'rc1b-3to2wlk3cs3kkt0a.mdb.yandexcloud.net',
      port: 6432,
      dialect: 'postgres',
      dialectOptions: {
        ssl: true
      }
    })
	} catch(error) {
		console.error(error)
	}	
}

if (NODE_ENV == 'dev') {
	sequelize = new Sequelize(DEV_DB_URI)
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

db.sequelize = sequelize
db.Sequelize = Sequelize

if (FIRST_START == 'true') {
  db.sequelize.sync({ force: true })
} else {
  db.sequelize.sync()
}

module.exports = db