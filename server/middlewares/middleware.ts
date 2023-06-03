import { Request, Response, NextFunction } from 'express'

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

export { checkToken, checkAdmin }