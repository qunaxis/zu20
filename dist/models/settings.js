'use strict';

var _sequelize = require('sequelize');

var _sequelize2 = _interopRequireDefault(_sequelize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = (sequelize, DataTypes) => {
  let Setting = sequelize.define('Setting', {
    id: { type: _sequelize2.default.INTEGER, primaryKey: true, defaultValue: _sequelize2.default.INTEGER, autoIncrement: true }, // UUID или не UUID? Он ублюдский))
    parameter: _sequelize2.default.STRING,
    value: _sequelize2.default.STRING
    // author: Sequelize.STRING
    // antidot: Sequelize.STRING,
    // infected: Sequelize.STRING,
    // timer: Sequelize.STRING
  });
  // module.exports = (sequelize, DataTypes) => {
  //   let User = sequelize.define('User', {
  //     id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV1 },
  //     number: { type: Sequelize.INTEGER, autoIncrement: true },
  //     firstname: Sequelize.STRING,
  //     secondname: Sequelize.STRING,
  //     patronymic:  { type: Sequelize.STRING, allowNull: true },
  //     passSerial: Sequelize.INTEGER,
  //     passNumber: Sequelize.INTEGER,
  //     birth: Sequelize.DATE,
  //     email: { type: Sequelize.STRING, allowNull: true },
  //     phoneMain: Sequelize.STRING,
  //     phoneAdditional: { type: Sequelize.STRING, allowNull: true },
  //     services:  { type: Sequelize.TEXT, allowNull: true },
  //     password: Sequelize.STRING,
  //     passwordConfirm: Sequelize.STRING,  
  //     userAgreement: { type: Sequelize.BOOLEAN, defaultValue: true },  
  //     dataProcessed: { type: Sequelize.BOOLEAN, defaultValue: true },
  //     offerAgreement: { type: Sequelize.BOOLEAN, defaultValue: true },  
  //     offerAgreement: { type: Sequelize.BOOLEAN, defaultValue: true },
  //     bitrixLeadId: { type: Sequelize.INTEGER, allowNull: true },
  //     bitrixContactId: { type: Sequelize.INTEGER, allowNull: true },  
  //   }
  // )

  //   User.associate = function(models) {
  //     models.User.hasMany(models.Task)
  //   }

  return Setting;
};
//# sourceMappingURL=settings.js.map