import { Request, Response, NextFunction } from 'express'
import datasetsController from '../controllers/datasets'
import jwt from 'jsonwebtoken'
import { StatusCodes } from 'http-status-codes';

// Middleware per verificare se l'utente è il proprietario del dataset
const checkOwner = async (request: Request, response: Response, next: NextFunction) => {
    console.log("Checking owner")
    const datasetUID = request.params.id
    const dataset = await datasetsController.getOneById(parseInt(datasetUID))
    if (!dataset) {
        return response.status(StatusCodes.NOT_FOUND).json({ message: 'Dataset not found' })
    }
    const userUID = (request as any).uid
    if ((dataset as any).userUID == userUID) {
        next()
    } else {
        response.status(StatusCodes.FORBIDDEN).json({
            message: 'You are not the owner of this dataset'
        })
    }
}

// Middleware per verificare l'autenticazione dell'utente
const checkAuth = async (request: Request, response: Response, next: NextFunction) => {
    console.log("Checking auth")
    const token = request.headers.authorization?.split(" ")[1]
    if (token) {
        try {
            const decoded: any = jwt.verify(token, process.env.SECRET_KEY || "");
            (request as any).uid = decoded.id
            next()
        } catch (error) {
            response.status(StatusCodes.UNAUTHORIZED).send({ message: 'Token not valid' })
        }
    } else {
        response.status(StatusCodes.UNAUTHORIZED).send({ message: 'Token not provided' })
    }
}

export { checkAuth, checkOwner }