import { Request, Response, NextFunction } from 'express'
import controller from '../controllers/users'
import jwt from 'jsonwebtoken';

const checkAdmin = async (request: Request, response: Response, next: NextFunction) => {
    console.log("Checking admin")
    const USER = await controller.getOneById(parseInt((request as any).id))
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
            const decoded: any = jwt.verify(token, process.env.SECRET_KEY || "")
            const id = (request.method === 'POST') ? request.body.id : request.params.id;
            if (id == decoded.id) {
                (request as any).id = decoded.id
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

export { checkAdmin, checkAuth }