import { Request, Response, NextFunction } from 'express'
import controller from '../controllers/users'
import jwt from 'jsonwebtoken';

const checkAdmin = async (request: Request, response: Response, next: NextFunction) => {
    console.log("Checking admin")
    const USER = await controller.getOneById(parseInt((request as any).UID))
    if (USER?.get("admin") === true) {
        next()
    } else {
        response.status(401).send("Unauthorized")
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

const checkOwner = async (request: Request, response: Response, next: NextFunction) => {
    console.log("Checking owner")
    const token = request.headers.authorization?.split(" ")[1]
    if (token) {
        try {
            const decoded: any = jwt.verify(token, process.env.SECRET_KEY || "");
            const UID = (request.method === 'POST') ? request.body.id : request.params.id
            if (UID == decoded.id) {
                (request as any).UID = decoded.id
                next()
            } else {
                response.status(401).send("Unauthorized")
            }
        } catch (error) {
            response.status(401).send({ message: 'Token not valid' })
        }
    } else {
        response.status(401).send({ message: 'Token not provided' })
    }
}

const checkToken = async (request: Request, response: Response, next: NextFunction) => {
    console.log("Checking token")
    const creds = await controller.getCreds((request as any).UID)
    if (creds > 0){
        next()
    } else {
        response.status(401).send({ message: 'Not enough tokens' })
    }
    
}

export { checkAdmin, checkAuth, checkOwner, checkToken }