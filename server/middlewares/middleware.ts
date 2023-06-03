import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken';

const checkToken = async (request: Request, response: Response, next: NextFunction) => {
    console.log("Checking token")
    if (request.query.token) {
        try {
            const parsedValue = parseInt(request.query.token as string, 10);
            if (isNaN(parsedValue)) {
                throw new Error('Invalid number');
            }
            if (parsedValue === 0) {
                response.status(401).send("Unauthorized")
            }
            next()
        } catch (error) {
            return response.status(400).send('Invalid token');
        }
    } else {
        return response.status(400).send('Invalid token');
    }
}

const checkAdmin = async (request: Request, response: Response, next: NextFunction) => {
    console.log("Checking admin")
    next()
}

const checkAuth = async (request: Request, response: Response, next: NextFunction) => {
    console.log("Checking authentication")
    const token = request.headers.authorization?.split(" ")[1]
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.SECRET_KEY || "").toString()
            const decodedJSON = JSON.parse(decoded)
            console.log(decodedJSON)
            /*const id = request.params.id
            if (id === decodedJSON.id) {
                next()
            } else {
                response.status(401).send("Unauthorized")
            }*/
            next()
        } catch (error) {
            response.status(401).send({ message: 'Token not valid.' })
        }
    } else {
        response.status(401).send({ message: 'Token not provided.' })
    }
}

export { checkToken, checkAdmin, checkAuth }