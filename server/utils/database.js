"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Importazione del modulo Sequelize
const sequelize_1 = require("sequelize");
// Creazione di un'istanza di Sequelize per la connessione al database
const sequelize = new sequelize_1.Sequelize(process.env.PGDATABASE || "", // Nome del database
process.env.PGUSER || "", // Nome utente del database
process.env.PGPASSWORD || "", // Password del database
{
    host: process.env.DB_HOST,
    dialect: "postgres", // Utilizzo del dialetto PostgreSQL
});
exports.default = sequelize; // Esportazione dell'istanza di Sequelize per l'uso in altri moduli
