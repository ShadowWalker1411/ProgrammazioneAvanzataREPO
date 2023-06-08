import Sequelize from "sequelize"
import sequelize from "../utils/database"

// Definizione del modello Model
const Model = sequelize.define("models", {
    uid: {
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

// Esportazione del modello Model per l'uso in altri moduli
export default Model