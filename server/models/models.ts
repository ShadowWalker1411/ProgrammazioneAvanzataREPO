import Sequelize from "sequelize"
import sequelize from "../utils/database"

const Models = sequelize.define("model", {
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
    datasetUID: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    userUID: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
})

export default Models