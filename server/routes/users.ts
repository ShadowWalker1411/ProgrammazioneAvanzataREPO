import express from 'express'
import controller from '../controllers/users'
import { checkAdmin, checkAuth, checkOwner } from '../middlewares/users'

// Creazione di un router per le rotte degli utenti
const router = express.Router()

router
    .get('/', controller.getAll) // Rotta per ottenere tutti gli utenti
    .get('/:id', checkOwner, controller.getById) // Rotta per ottenere un utente tramite ID
    .post('/', controller.create) // Rotta per creare un nuovo utente
    .put('/:id', checkOwner, controller.updateById) // Rotta per aggiornare un utente tramite ID
    .delete('/:id', checkOwner, controller.deleteById) // Rotta per eliminare un utente tramite ID

router
    .post('/login', controller.login) // Rotta per l'accesso degli utenti
    .get('/credits/mine', checkAuth, controller.getCredits) // Rotta per ottenere i crediti dell'utente corrente
    .post('/credits/:email', checkAuth, checkAdmin, controller.addCredits) // Rotta per aggiungere crediti a un utente tramite email

export default router // Esportazione del router per l'uso in altri moduli
