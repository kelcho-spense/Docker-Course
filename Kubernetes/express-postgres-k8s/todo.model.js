const { DataTypes } = require('sequelize');
const sequelize = require('./db');

const Todo = sequelize.define('Todo', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

// Sync the model with the database
sequelize.sync()
  .then(() => {
    console.log('Todo model synced with the database.');
  })
  .catch(err => {
    console.error('Failed to sync model with the database:', err);
  });

module.exports = Todo;