"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize = new sequelize_1.Sequelize(process.env.PGDATABASE || "", process.env.PGUSER || "", process.env.PGPASSWORD || "", {
    host: process.env.DB_HOST,
    dialect: "postgres",
});
exports.default = sequelize;
