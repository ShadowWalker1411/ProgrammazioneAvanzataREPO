"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = __importDefault(require("sequelize"));
const database_1 = __importDefault(require("../utils/database"));
const Model = database_1.default.define("models", {
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
    datasetUID: {
        type: sequelize_1.default.INTEGER,
        allowNull: false,
    },
    userUID: {
        type: sequelize_1.default.INTEGER,
        allowNull: false,
    },
});
exports.default = Model;
