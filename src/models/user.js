import Sequelize from 'sequelize'

module.exports = (sequelize, DataTypes) => {
  let User = sequelize.define('User', {
    id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV1 },
    number: { type: Sequelize.INTEGER(8).ZEROFILL, autoIncrement: true },
    firstname: Sequelize.STRING,
    secondname: Sequelize.STRING,
    patronymic:  { type: Sequelize.STRING, allowNull: true },
    passSerial: Sequelize.INTEGER,
    passNumber: Sequelize.INTEGER,
    birth: Sequelize.DATE,
    email: { type: Sequelize.STRING, allowNull: true },
    phoneMain: Sequelize.STRING,
    phoneAdditional: { type: Sequelize.STRING, allowNull: true },
    services:  { type: Sequelize.TEXT, allowNull: true },
    password: Sequelize.STRING,
    passwordConfirm: Sequelize.STRING,  
    userAgreement: { type: Sequelize.BOOLEAN, defaultValue: true },  
    dataProcessed: { type: Sequelize.BOOLEAN, defaultValue: true }
  }
)

//   User.associate = function(models) {
//     models.User.hasMany(models.Task)
//   }

  return User
}