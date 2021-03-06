import express from 'express'
import path from 'path'
import logger from 'morgan'
import bodyParser from 'body-parser'
import cors from 'cors'
import db from './models/index'
import bot from './bot'

import Intl from "intl"

const app = express()

app.use(cors())
app.disable('x-powered-by')

// View engine setup
app.set('views', path.join(__dirname, '../views'))
app.set('view engine', 'pug')

app.use(logger('dev', {
  skip: () => app.get('env') === 'test'
}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, '../public')))
app.use(express.static(path.join(__dirname, '../docs')))



app.get('/', async(req, res) => {
  let data = {}
  let status = await db.getStatus()
  // let immunitet = await db.getAvgImmunitet()
  data = {
    // antidot: status.antidot,
    // infected: status.infected,
    timer: status.timer,
    // immunitet: immunitet
  }
  console.log(data)
  res.render('index', data)
})

app.get('/:hash', async (req, res, next) => {
  const reqHash = req.params['hash']
  req.params['hash'] == 'favicon.ico' ? next() : null
  let immun = await db.Immun.findOne({
    where: {
      hash: req.params['hash']
    }
  })
  console.log(immun)
  immun = immun.dataValues
  // console.log(immun)
  let status = await db.getStatus()
  let immunitet = await db.getImmunitet(req.params['hash'])
  console.log(immunitet)
  // app.get('/', async (req, res) => {
  // let data = await db.Immun.findAll({
  //   where: {
  //     hash: req.params['hash']
  //   }
  // })
  const formatter = new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    // weekday: 'long',
  });
  const data = {
    title: 'ZU20',
    // message: 'gnlkjf',
    immunitet: immunitet,
    antidot: status.antidot,
    infected: status.infected,
    timer: status.timer,
    hash: immun.hash,
    passport: {
      secondname: immun.secondname,
      firstname: immun.firstname,
      patronymic: immun.patronymic,
      birth: formatter.format(immun.birth),
      faculty: immun.faculty,
      group: immun.group,
      organization: immun.organization,
      phone: immun.phone
    },
    passportTranslation: {
      secondname: 'Фамилия',
      firstname: 'Имя',
      patronymic: 'Отчество',
      birth: 'Дата рождения',
      faculty: 'Область специализации',
      group: 'Код специализации',
      organization: 'Статус Н.И.М.Б.',
      phone: 'Телефон'
    }
  }
  console.log(data)
  res.render('profile', data)
  // res.render('index', { title: 'Hey', message: data[0].dataValues.secondname});
})

// const data = fs.readFileSync(path.join(__dirname, '../docs/users.csv'), 'utf8')
// let genHash = new RandomHash({
//   length: 6,
//   charset: 'ABCDEFGHKLMNPQRSTUVXYZ0123456789',
//   rng: randomBytes
// })
// let result = []
// let hashedUsers = []
// fs.createReadStream(path.join(__dirname, '../docs/users.csv'))
//   .pipe(csvParser({
//     separator: ';',
//     headers: ['id', 'secondname', 'firstname', 'patronymic', 'birth', 'faculty', 'group', 'phone', 'organization' ]
//   }))
//   .on('data', (data) => result.push(data))
//   .on('end', () => {
//     // console.log(result);
//     result.forEach(user => {
//       // user.id = parseInt(user.id)
//       delete user.id
//       user.hash = genHash()
//       hashedUsers.push(user)
//       console.log(user)
//     })
//     db.User.bulkCreate(hashedUsers)
//     // [
//     //   { NAME: 'Daffy Duck', AGE: '24' },
//     //   { NAME: 'Bugs Bunny', AGE: '22' }
//     // ]
//   });




// console.log(hashedUsers)



// db.User.bulkCreate()
// const array = convertCSVToArray(data, {
//   header: true,
//   type: 'array',
//   separator: ';', // use the separator you use in your csv (e.g. '\t', ',', ';' ...)
// });

// console.log(array)

  // columns: ['id', 'secondname', 'firstname', 'patronymic', 'birth', 'faculty', 'group', 'phone', 'organization' ]

app.get('/docs/hash', (req, res, next) => {
  res.sendFile(`hash.csv`, { root: path.join(__dirname, `../docs`) })
})
app.get('/docs/qrs', (req, res, next) => {
  res.sendFile(`QRs.zip`, { root: path.join(__dirname, `../docs`) })
})





// app.get('/gethuy', (req, res, next) => {
//   // res.sendFile('index.html', { root: path.join(__dirname, '../public') })
//   res.json({ get: "huy" })
// })



// SEND SPA TO CLIENT + CLIENT ROUTING :)
// app.get('*', (req, res, next) => {
//   res.sendFile('index.html', { root: path.join(__dirname, '../public') })
// })


// Routes
// app.use('/api/v1', routes)
// app.use('/api', routes)
// app.use('/api/v1/master', user)
// app.use('/api/v1/request', request)

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

// Error handler
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  res
    .status(err.status || 500)
    .render('error', {
      message: err.message
    })
})

export default app
