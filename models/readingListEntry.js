const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class ReadingListEntry extends Model {}

ReadingListEntry.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    readingListId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'reading_lists', key: 'id' },
    },
    blogId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'blogs', key: 'id' },
    },
    readCheck: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'readingListEntry'
})

module.exports = ReadingListEntry