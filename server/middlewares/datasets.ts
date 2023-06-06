import { Request, Response, NextFunction } from 'express'
import controller from '../controllers/datasets'
import jwt from 'jsonwebtoken';

const checkOwner = async (request: Request, response: Response, next: NextFunction) => {
    console.log("Checking owner");
    const datasetUID = request.params.id; 
    const dataset = await controller.getOneById(parseInt(datasetUID));
    console.log(datasetUID);
    if (!dataset) {
        return response.status(404).json({ message: 'Dataset not found' });
    }
    const userUID = (request as any).UID;
    if ((dataset as any).userUID == userUID) {
        next();
    } else {
        response.status(403).json({
            message: 'You are not the owner of this dataset'
        });
    }
};


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