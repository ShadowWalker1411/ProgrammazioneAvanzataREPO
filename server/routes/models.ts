import express from 'express'
import controller from '../controllers/models'
import { checkAuth, checkOwner } from '../middlewares/models'
import { checkAdmin, checkTokenInference } from '../middlewares/users'

// Creazione di un router per le rotte dei modelli
const router = express.Router()

router
    .get('/all', checkAuth, checkAdmin, controller.getAll) // Rotta per ottenere tutti i modelli (solo per amministratori autenticati)
    .get('/', checkAuth, controller.getAllMine) // Rotta per ottenere i modelli dell'utente corrente (autenticazione richiesta)
    .get('/:id', checkAuth, checkOwner, controller.getById) // Rotta per ottenere un modello tramite ID (solo per il proprietario autenticato)
    .post('/', checkAuth, controller.create) // Rotta per creare un nuovo modello (autenticazione richiesta)
    .put('/:id', checkAuth, checkOwner, controller.updateById) // Rotta per aggiornare un modello tramite ID (solo per il proprietario autenticato)
    .delete('/:id', checkAuth, checkOwner, controller.deleteById) // Rotta per eliminare un modello tramite ID (solo per il proprietario autenticato)
    .post('/image/:id', checkAuth, checkOwner, controller.uploadFile) // Rotta per caricare un'immagine di un modello tramite ID (solo per il proprietario autenticato)

router
    .get('/inference/:id', checkAuth, checkOwner, checkTokenInference, controller.inference) // Rotta per l'inferenza di un modello tramite ID (autenticazione e token di inferenza richiesti)(solo per il proprietario autenticato)
    .get('/status/:job_id', checkAuth, controller.status) // Rotta per ottenere lo stato di un lavoro di inferenza tramite ID (autenticazione richiesta)
    .get('/result/:job_id', checkAuth, controller.result) // Rotta per ottenere il risultato di un lavoro di inferenza tramite ID (autenticazione richiesta)

export default router // Esportazione del router per l'uso in altri moduli
