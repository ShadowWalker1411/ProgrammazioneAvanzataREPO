import express from 'express'
import controller from '../controllers/users'

const router = express.Router();

router
    .get('/', controller.getAll)
    .get('/:id', controller.getById)
    .post('/', controller.create)
    .put('/:id', controller.updateById)
    .delete('/:id', controller.deleteById)

router.post('/login', controller.login)

export default router;