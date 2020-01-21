import Sequelize from 'sequelize'

module.exports = (sequelize, DataTypes) => {
  let Immun = sequelize.define('Immun', {
    id: { type: Sequelize.INTEGER, primaryKey: true, defaultValue: Sequelize.INTEGER },
    secondname: Sequelize.STRING,
    firstname: Sequelize.STRING,
    patronymic:  { type: Sequelize.STRING, allowNull: true },
    birth: Sequelize.DATE,
    faculty: Sequelize.STRING,
    group: Sequelize.STRING,
    phone: Sequelize.STRING,
    organization: Sequelize.STRING,
    hash: Sequelize.STRING,
  }
)
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

  return Immun
}