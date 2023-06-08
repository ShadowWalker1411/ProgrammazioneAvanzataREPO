"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const datasets_1 = __importDefault(require("../controllers/datasets"));
const datasets_2 = require("../middlewares/datasets");
const users_1 = require("../middlewares/users");
// Creazione di un router per le rotte dei dataset
const router = express_1.default.Router();
router
    .get('/all', datasets_2.checkAuth, users_1.checkAdmin, datasets_1.default.getAll) // Rotta per ottenere tutti i dataset (solo per amministratori autenticati)
    .get('/', datasets_2.checkAuth, datasets_1.default.getAllMine) // Rotta per ottenere i dataset dell'utente corrente (autenticazione richiesta)
    .get('/:id', datasets_2.checkAuth, datasets_2.checkOwner, datasets_1.default.getById) // Rotta per ottenere un dataset tramite ID (solo per il proprietario autenticato)
    .post('/', datasets_2.checkAuth, datasets_1.default.create) // Rotta per creare un nuovo dataset (autenticazione richiesta)
    .put('/:id', datasets_2.checkAuth, datasets_2.checkOwner, datasets_1.default.updateById) // Rotta per aggiornare un dataset tramite ID (solo per il proprietario autenticato)
    .delete('/:id', datasets_2.checkAuth, datasets_2.checkOwner, datasets_1.default.deleteById) // Rotta per eliminare un dataset tramite ID (solo per il proprietario autenticato)
    .post('/image/:id', datasets_2.checkAuth, datasets_2.checkOwner, datasets_1.default.uploadImage) // Rotta per caricare un'immagine di un dataset tramite ID (solo per il proprietario autenticato)
    .post('/images/:id', datasets_2.checkAuth, datasets_2.checkOwner, datasets_1.default.uploadImages) // Rotta per caricare immagini di un dataset tramite ID (solo per il proprietario autenticato)
    .post('/zip/:id', datasets_2.checkAuth, datasets_2.checkOwner, datasets_1.default.uploadZip); // Rotta per caricare un file ZIP di un dataset tramite ID (solo per il proprietario autenticato)
exports.default = router; // Esportazione del router per l'uso in altri moduli
