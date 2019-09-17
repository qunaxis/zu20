import express from 'express'
import path from 'path'
import logger from 'morgan'
import bodyParser from 'body-parser'
import cors from 'cors'

// import routes from './routes'
import user from './v1/user'
import request from './v1/request'

const app = express()
// const db = new Database

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


app.get('/docs/pd', (req, res, next) => {
  res.sendFile(`pd.pdf`, { root: path.join(__dirname, `../docs`) })
})
app.get('/docs/offer', (req, res, next) => {
  res.sendFile(`offer.pdf`, { root: path.join(__dirname, `../docs`) })
})
app.get('/docs/politics', (req, res, next) => {
  res.sendFile(`politics.pdf`, { root: path.join(__dirname, `../docs`) })
})

// app.get('/docs', (req, res, next) => {
//   const docPath = `..${req.baseUrl + req.path}`
//   // const docName = `..${req.path}.pdf`
//   console.log(req)
//   // console.log(docPath)
//   res.download(path.join(__dirname, `..${req.path}`), `${req.query.name}.pdf`)
// })

// SEND SPA TO CLIENT + CLIENT ROUTING :)
app.get('*', (req, res, next) => {
  res.sendFile('index.html', { root: path.join(__dirname, '../public') })
})


// Routes
// app.use('/api/v1', routes)
// app.use('/api', routes)
app.use('/api/v1/master', user)
app.use('/api/v1/request', request)
// app.post('/gethuy', (req, res, next) => {
//   // res.sendFile('index.html', { root: path.join(__dirname, '../public') })
//   res.json({ get: "huy" })
// })

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
