import Sequelize from 'sequelize'

module.exports = (sequelize, DataTypes) => {
  let User = sequelize.define('Request', {
    id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV1 },
    number: { type: Sequelize.INTEGER(8).ZEROFILL, autoIncrement: true },
    name: Sequelize.STRING,
    phone: Sequelize.STRING, 
    userAgreement: { type: Sequelize.BOOLEAN, defaultValue: true },  
    dataProcessed: { type: Sequelize.BOOLEAN, defaultValue: true }
  }
)

//   User.associate = function(models) {
//     models.User.hasMany(models.Task)
//   }

  return User
}