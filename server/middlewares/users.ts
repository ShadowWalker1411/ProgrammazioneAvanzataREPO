import { Request, Response, NextFunction } from 'express'
import usersController from '../controllers/users'
import jwt from 'jsonwebtoken'
import { StatusCodes } from 'http-status-codes';

// Middleware per verificare se l'utente è un amministratore
const checkAdmin = async (request: Request, response: Response, next: NextFunction) => {
    console.log("Checking admin")
    const USER = await usersController.getOneById(parseInt((request as any).uid))
    if (USER?.get("admin") === true) {
        next()
    } else {
        response.status(StatusCodes.UNAUTHORIZED).send("Unauthorized")
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

// Middleware per verificare se l'utente è il proprietario
const checkOwner = async (request: Request, response: Response, next: NextFunction) => {
    console.log("Checking owner")
    const token = request.headers.authorization?.split(" ")[1]
    if (token) {
        try {
            const decoded: any = jwt.verify(token, process.env.SECRET_KEY || "")
            const UID = request.params.id
            if (UID == decoded.id) {
                (request as any).uid = decoded.id
                next()
            } else {
                response.status(StatusCodes.UNAUTHORIZED).send("Unauthorized")
            }
        } catch (error) {
            response.status(StatusCodes.UNAUTHORIZED).send({ message: 'Token not valid' })
        }
    } else {
        response.status(StatusCodes.UNAUTHORIZED).send({ message: 'Token not provided' })
    }
}

// Middleware per verificare i token prima di un'inferenza
const checkTokenInference = async (request: Request, response: Response, next: NextFunction) => {
    console.log("Checking token")
    const creds = await usersController.getCreds((request as any).uid)
    if (creds >= 5){
        next()
    } else {
        response.status(StatusCodes.UNAUTHORIZED).send({ message: 'Not enough tokens' })
    } 
}

export { checkAdmin, checkAuth, checkOwner, checkTokenInference }