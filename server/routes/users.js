"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_1 = __importDefault(require("../controllers/users"));
const users_2 = require("../middlewares/users");
// Creazione di un router per le rotte degli utenti
const router = express_1.default.Router();
router
    .get('/', users_1.default.getAll) // Rotta per ottenere tutti gli utenti
    .get('/:id', users_2.checkOwner, users_1.default.getById) // Rotta per ottenere un utente tramite ID
    .post('/', users_1.default.create) // Rotta per creare un nuovo utente
    .put('/:id', users_2.checkOwner, users_1.default.updateById) // Rotta per aggiornare un utente tramite ID
    .delete('/:id', users_2.checkOwner, users_1.default.deleteById); // Rotta per eliminare un utente tramite ID
router
    .post('/login', users_1.default.login) // Rotta per l'accesso degli utenti
    .get('/credits/mine', users_2.checkAuth, users_1.default.getCredits) // Rotta per ottenere i crediti dell'utente corrente
    .post('/credits/:email', users_2.checkAuth, users_2.checkAdmin, users_1.default.addCredits); // Rotta per aggiungere crediti a un utente tramite email
exports.default = router; // Esportazione del router per l'uso in altri moduli
