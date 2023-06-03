import express from 'express'
import { checkToken, checkAdmin } from '../middlewares/middleware'
import Controller from '../controllers/dev'

const router = express.Router();

const controller = new Controller()

router.get('/version', checkToken, checkAdmin, controller.version)

export default router