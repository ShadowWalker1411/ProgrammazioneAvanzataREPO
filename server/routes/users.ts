import express from 'express'
import controller from '../controllers/users'
import { checkAdmin, checkAuth, checkOwner } from '../middlewares/users';

const router = express.Router();

router
    .get('/', controller.getAll)
    .get('/:id', checkOwner, controller.getById)
    .post('/', controller.create)
    .put('/:id', checkOwner, controller.updateById)
    .delete('/:id', checkOwner, controller.deleteById)

router
    .post('/login', controller.login)
    .get('/credits/mine', checkAuth, controller.getCredits)
    .post('/credits/:email', checkAuth, checkAdmin, controller.addCredits)

export default router;