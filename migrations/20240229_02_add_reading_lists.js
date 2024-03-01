const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('reading_lists', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.TEXT,
            allowNull: false,
            unique: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'users', key: 'id' }
        }
    })
    await queryInterface.createTable('reading_list_entries', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        reading_list_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'reading_lists', key: 'id' },
        },
        blog_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'blogs', key: 'id' },
        },
        read_check: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
      })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('reading_lists')
    await queryInterface.dropTable('reading_list_entries')
  },
}