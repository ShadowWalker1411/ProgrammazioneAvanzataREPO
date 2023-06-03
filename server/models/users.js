"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = __importDefault(require("sequelize"));
const database_1 = __importDefault(require("../utils/database"));
const User = database_1.default.define("user", {
    id: {
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
        type: sequelize_1.default.INTEGER,
        allowNull: false,
        defaultValue: process.env.CREDITS || 5000
    }
});
exports.default = User;
