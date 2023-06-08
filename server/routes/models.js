"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const models_1 = __importDefault(require("../controllers/models"));
const models_2 = require("../middlewares/models");
const users_1 = require("../middlewares/users");
// Creazione di un router per le rotte dei modelli
const router = express_1.default.Router();
router
    .get('/all', models_2.checkAuth, users_1.checkAdmin, models_1.default.getAll) // Rotta per ottenere tutti i modelli (solo per amministratori autenticati)
    .get('/', models_2.checkAuth, models_1.default.getAllMine) // Rotta per ottenere i modelli dell'utente corrente (autenticazione richiesta)
    .get('/:id', models_2.checkAuth, models_2.checkOwner, models_1.default.getById) // Rotta per ottenere un modello tramite ID (solo per il proprietario autenticato)
    .post('/', models_2.checkAuth, models_1.default.create) // Rotta per creare un nuovo modello (autenticazione richiesta)
    .put('/:id', models_2.checkAuth, models_2.checkOwner, models_1.default.updateById) // Rotta per aggiornare un modello tramite ID (solo per il proprietario autenticato)
    .delete('/:id', models_2.checkAuth, models_2.checkOwner, models_1.default.deleteById) // Rotta per eliminare un modello tramite ID (solo per il proprietario autenticato)
    .post('/image/:id', models_2.checkAuth, models_2.checkOwner, models_1.default.uploadFile); // Rotta per caricare un'immagine di un modello tramite ID (solo per il proprietario autenticato)
router
    .get('/inference/:id', models_2.checkAuth, models_2.checkOwner, users_1.checkTokenInference, models_1.default.inference) // Rotta per l'inferenza di un modello tramite ID (autenticazione e token di inferenza richiesti)(solo per il proprietario autenticato)
    .get('/status/:job_id', models_2.checkAuth, models_1.default.status) // Rotta per ottenere lo stato di un lavoro di inferenza tramite ID (autenticazione richiesta)
    .get('/result/:job_id', models_2.checkAuth, models_1.default.result); // Rotta per ottenere il risultato di un lavoro di inferenza tramite ID (autenticazione richiesta)
exports.default = router; // Esportazione del router per l'uso in altri moduli
