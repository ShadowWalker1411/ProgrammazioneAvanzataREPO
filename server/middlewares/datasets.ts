import { Request, Response, NextFunction } from 'express'
import controller from '../controllers/datasets'

const checkOwner = async (request: Request, response: Response, next: NextFunction) => {
    console.log("Checking owner")
    const datasetUID = (request.method === 'POST') ? request.body.UID : request.params.UID;
    const userUID = (request as any).UID
    const dataset = await controller.getOneById(datasetUID)
    if (!dataset) {
        return response.status(404).json({ message: 'Dataset not found' })
    }
    if ((dataset as any).userUID == userUID) {
        next()
    } else {
        response.status(403).json({
            message: 'You are not the owner of this dataset'
        })
    }
}

export { checkOwner }