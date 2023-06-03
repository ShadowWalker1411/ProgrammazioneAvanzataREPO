import express from 'express'
import controller from '../controllers/users'
import { checkAuth } from '../middlewares/middleware';

const router = express.Router();

router
    .get('/', controller.getAll)
    .get('/:id', checkAuth, controller.getById)
    .post('/', controller.create)
    .put('/:id', controller.updateById)
    .delete('/:id', controller.deleteById)

router.post('/login', controller.login)

export default router;