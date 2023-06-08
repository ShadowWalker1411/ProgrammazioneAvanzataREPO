import express from 'express'
import controller from '../controllers/datasets'
import { checkAuth, checkOwner } from '../middlewares/datasets'
import { checkAdmin } from '../middlewares/users'

// Creazione di un router per le rotte dei dataset
const router = express.Router()

router
    .get('/all', checkAuth, checkAdmin, controller.getAll) // Rotta per ottenere tutti i dataset (solo per amministratori autenticati)
    .get('/', checkAuth, controller.getAllMine) // Rotta per ottenere i dataset dell'utente corrente (autenticazione richiesta)
    .get('/:id', checkAuth, checkOwner, controller.getById) // Rotta per ottenere un dataset tramite ID (solo per il proprietario autenticato)
    .post('/', checkAuth, controller.create) // Rotta per creare un nuovo dataset (autenticazione richiesta)
    .put('/:id', checkAuth, checkOwner, controller.updateById) // Rotta per aggiornare un dataset tramite ID (solo per il proprietario autenticato)
    .delete('/:id', checkAuth, checkOwner, controller.deleteById) // Rotta per eliminare un dataset tramite ID (solo per il proprietario autenticato)
    .post('/image/:id', checkAuth, checkOwner, controller.uploadImage) // Rotta per caricare un'immagine di un dataset tramite ID (solo per il proprietario autenticato)
    .post('/images/:id', checkAuth, checkOwner, controller.uploadImages) // Rotta per caricare immagini di un dataset tramite ID (solo per il proprietario autenticato)
    .post('/zip/:id', checkAuth, checkOwner, controller.uploadZip) // Rotta per caricare un file ZIP di un dataset tramite ID (solo per il proprietario autenticato)

export default router // Esportazione del router per l'uso in altri moduli
