"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = __importDefault(require("sequelize"));
const database_1 = __importDefault(require("../utils/database"));
// Definizione del modello Dataset
const Dataset = database_1.default.define("dataset", {
    UID: {
        type: sequelize_1.default.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    name: {
        type: sequelize_1.default.STRING,
        allowNull: false,
        unique: true,
    },
    tags: {
        type: sequelize_1.default.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    numClasses: {
        type: sequelize_1.default.INTEGER,
        allowNull: false,
        defaultValue: 2
    },
    userUID: {
        type: sequelize_1.default.INTEGER,
        allowNull: false,
    },
});
// Esportazione del modello Dataset per l'uso in altri moduli
exports.default = Dataset;
