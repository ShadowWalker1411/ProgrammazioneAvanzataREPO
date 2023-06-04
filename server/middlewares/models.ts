import { Request, Response, NextFunction } from 'express'
import controller from '../controllers/models'

const checkOwner = async (request: Request, response: Response, next: NextFunction) => {
    console.log("Checking owner")
    const modelUID = (request.method === 'POST') ? request.body.UID : request.params.UID;
    const userUID = (request as any).UID
    const model = await controller.getOneById(modelUID)
    if (!model) {
        return response.status(404).json({ message: 'modello non trovato' })
    }
    if ((model as any).userUID == userUID) {
        next()
    } else {
        response.status(403).json({
            message: 'Non sei il proprietario di questo modello'
        })
    }
}

export { checkOwner }