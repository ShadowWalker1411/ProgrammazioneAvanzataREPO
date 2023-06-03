import express from 'express'
import controller from '../controllers/users'
import { checkAdmin, checkAuth } from '../middlewares/middleware';

const router = express.Router();

router
    .get('/', controller.getAll)
    .get('/:id', checkAuth, checkAdmin, controller.getById)
    .post('/', controller.create)
    .put('/:id', checkAuth, controller.updateById)
    .delete('/:id', checkAuth, controller.deleteById)

router.post('/login', controller.login)

export default router;