import express from 'express'
import controller from '../controllers/datasets'
import { checkAuth, checkOwner } from '../middlewares/datasets';
import { checkAdmin } from '../middlewares/users';

const router = express.Router();

router
    .get('/all', checkAuth, checkAdmin, controller.getAll)
    .get('/', checkAuth, controller.getAllMine)
    .get('/:id', checkAuth, checkOwner, controller.getById)
    .post('/', checkAuth, controller.create)
    .put('/:id', checkAuth, checkOwner, controller.updateById)
    .delete('/:id', checkAuth, checkOwner, controller.deleteById)
    .post('/image/:id', checkAuth, checkOwner, controller.uploadImage)
    .post('/images/:id', checkAuth, checkOwner, controller.uploadImages)
    .post('/zip/:id', checkAuth, checkOwner, controller.uploadZip)

export default router;