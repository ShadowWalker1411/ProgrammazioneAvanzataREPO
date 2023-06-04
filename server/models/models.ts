import Sequelize from "sequelize"
import sequelize from "../utils/database"

const Models = sequelize.define("models", {
    UID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    DatasetUID: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
    },
    UserUID: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
})

export default Models