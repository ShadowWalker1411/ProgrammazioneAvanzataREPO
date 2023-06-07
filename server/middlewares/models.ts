import { Request, Response, NextFunction } from 'express'
import modelsController from '../controllers/models'
import jwt from 'jsonwebtoken';

const checkOwner = async (request: Request, response: Response, next: NextFunction) => {
    console.log("Checking owner")
    const modelUID = request.params.id;
    const model = await modelsController.getOneById(parseInt(modelUID))
    if (!model) {
        return response.status(404).json({ message: 'modello non trovato' })
    }
    const userUID = (request as any).UID
    if ((model as any).userUID == userUID) {
        next()
    } else {
        response.status(403).json({
            message: 'Non sei il proprietario di questo modello'
        })
    }
}

const checkAuth = async (request: Request, response: Response, next: NextFunction) => {
    console.log("Checking auth")
    const token = request.headers.authorization?.split(" ")[1]
    if (token) {
        try {
            const decoded: any = jwt.verify(token, process.env.SECRET_KEY || "");
            (request as any).UID = decoded.id
            next()
        } catch (error) {
            response.status(401).send({ message: 'Token not valid' })
        }
    } else {
        response.status(401).send({ message: 'Token not provided' })
    }
}

export { checkAuth, checkOwner }