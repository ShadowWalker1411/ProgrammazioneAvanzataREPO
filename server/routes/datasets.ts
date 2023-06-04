import express from 'express'
import controller from '../controllers/datasets'
import { checkOwner } from '../middlewares/datasets';
import { checkAuth, checkAdmin } from '../middlewares/users';

const router = express.Router();

router
    .get('/all', checkAuth, checkAdmin, controller.getAll)
    .get('/', checkAuth, controller.getAllMine)
    .get('/:id', checkAuth, checkOwner, controller.getById)
    .post('/', checkAuth, controller.create)
    .put('/:id', checkAuth, checkOwner, controller.updateById)
    .delete('/:id', checkAuth, checkOwner, controller.deleteById)

export default router;