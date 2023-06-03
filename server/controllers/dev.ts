import { Request, Response, NextFunction } from "express";

export default class Controller {

    constructor() {}

    async version(request: Request, response: Response, next: NextFunction) {
        return response.status(200).json({
            "version": 3.0,
            "message": "API v2.0"
        })
    }
}