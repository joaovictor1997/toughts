const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('toughts', 'root', 'docker', {
  host:'localhost',
  dialect: 'mysql'
});

try {
  sequelize.authenticate()
  console.log('conectamos com sucesso');
} catch (error) {
  console.log(error);
}

module.exports = sequelize;