import Sequelize from "sequelize"
import sequelize from "../utils/database"

// Definizione del modello Dataset
const Dataset = sequelize.define("dataset", {
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
    tags: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    numClasses: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 2
    },
    userUID: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
})

// Esportazione del modello Dataset per l'uso in altri moduli
export default Dataset