import Sequelize from "sequelize"
import sequelize from "../utils/database"

// Definizione del modello User
const User = sequelize.define("user", {
    UID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    credits: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: process.env.CREDITS || 5000
    },
    admin: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
})

// Esportazione del modello User per l'uso in altri moduli
export default User