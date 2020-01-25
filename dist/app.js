'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _index = require('./models/index');

var _index2 = _interopRequireDefault(_index);

var _bot = require('./bot');

var _bot2 = _interopRequireDefault(_bot);

var _fs = require('fs');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = (0, _express2.default)();

app.use((0, _cors2.default)());
app.disable('x-powered-by');

// View engine setup
app.set('views', _path2.default.join(__dirname, '../views'));
app.set('view engine', 'pug');

app.use((0, _morgan2.default)('dev', {
  skip: () => app.get('env') === 'test'
}));
app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.urlencoded({ extended: false }));
app.use(_express2.default.static(_path2.default.join(__dirname, '../public')));
app.use(_express2.default.static(_path2.default.join(__dirname, '../docs')));

app.get('/', async (req, res) => {
  let data = {};
  let status = await _index2.default.getStatus();
  // let immunitet = await db.getAvgImmunitet()
  data = {
    // antidot: status.antidot,
    // infected: status.infected,
    timer: status.timer
    // immunitet: immunitet
  };
  console.log(data);
  res.render('index', data);
});

app.get('/:hash', async (req, res, next) => {
  const reqHash = req.params['hash'];
  req.params['hash'] == 'favicon.ico' ? next() : null;
  let immun = await _index2.default.Immun.findOne({
    where: {
      hash: req.params['hash']
    }
  });
  console.log(immun);
  immun = immun.dataValues;
  // console.log(immun)
  let status = await _index2.default.getStatus();
  let immunitet = await _index2.default.getImmunitet(req.params['hash']);
  console.log(immunitet);
  // app.get('/', async (req, res) => {
  // let data = await db.Immun.findAll({
  //   where: {
  //     hash: req.params['hash']
  //   }
  // })

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
      birth: `${immun.birth.toLocaleString('ru', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })}`,
      faculty: immun.faculty,
      group: immun.group,
      organization: immun.organization,
      phone: immun.phone
    },
    passportTranslation: {
      secondname: 'Фамилия',
      firstname: 'Имя',
      patronimyc: 'Отчество',
      birth: 'Дата рождения',
      faculty: 'Область специализации',
      group: 'Код специализации',
      organization: 'Статус Н.И.М.Б.',
      phone: 'Телефон'
    }
  };
  console.log(data);
  res.render('profile', data);
  // res.render('index', { title: 'Hey', message: data[0].dataValues.secondname});
});

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
  res.sendFile(`hash.csv`, { root: _path2.default.join(__dirname, `../docs`) });
});
app.get('/docs/qrs', (req, res, next) => {
  res.sendFile(`QRs.zip`, { root: _path2.default.join(__dirname, `../docs/qrs`) });
});

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
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handler
app.use((err, req, res, next) => {
  // eslint-disable-line no-unused-vars
  res.status(err.status || 500).render('error', {
    message: err.message
  });
});

exports.default = app;
//# sourceMappingURL=app.js.map