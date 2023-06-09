"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = __importDefault(require("sequelize"));
const database_1 = __importDefault(require("../utils/database"));
// Definizione del modello User
const User = database_1.default.define("user", {
    uid: {
        type: sequelize_1.default.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    username: {
        type: sequelize_1.default.STRING,
        allowNull: false,
        unique: true,
    },
    email: {
        type: sequelize_1.default.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: sequelize_1.default.STRING,
        allowNull: false,
    },
    credits: {
        type: sequelize_1.default.FLOAT,
        allowNull: false,
        defaultValue: process.env.CREDITS || 5000
    },
    admin: {
        type: sequelize_1.default.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
});
// Esportazione del modello User per l'uso in altri moduli
exports.default = User;
