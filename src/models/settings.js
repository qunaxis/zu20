import Sequelize from 'sequelize'

module.exports = (sequelize, DataTypes) => {
  let Setting = sequelize.define('Setting', {
    id: { type: Sequelize.INTEGER, primaryKey: true, defaultValue: Sequelize.INTEGER, autoIncrement: true }, // UUID или не UUID? Он ублюдский))
    parameter: Sequelize.STRING,
    value: Sequelize.STRING
    // author: Sequelize.STRING
    // antidot: Sequelize.STRING,
    // infected: Sequelize.STRING,
    // timer: Sequelize.STRING
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

  return Setting
}