import User from './../models/users';
import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const getAll = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const ALL = await User.findAll()
        return response.status(200).json(ALL)
    } catch (error) {
        return response.status(500).json(error)
    }
}

const getById = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const USER = await User.findByPk(request.params.id)
        return response.status(200).json(USER)
    } catch (error) {
        return response.status(500).json(error)
    }
}

const create = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const USER_MODEL = {
            username: request.body.username,
            email: request.body.email,
            password: bcrypt.hashSync(request.body.password, 8)
        }
        try {
            const USER = await User.create(USER_MODEL)
            return response.status(201).json(USER)
        } catch (error) {
            return response.status(500).json(error)
        }
    } catch (error) {
        return response.status(500).json(error)
    }
}

const updateById = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const USER_MODEL = {
            username: request.body.username,
            email: request.body.email,
            password: bcrypt.hashSync(request.body.password, 8)
        }
        try {
            const NROWS = await User.update(USER_MODEL, {where: {id: request.params.id}})
            return response.status(200).json(NROWS)
        } catch (error) {
            return response.status(500).json(error)
        }
    } catch (error) {
        return response.status(500).json(error)
    }
}

const deleteById = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const NROWS = await User.destroy({where: {id: request.params.id}})
        return response.status(200).json(NROWS)
    } catch (error) {
        return response.status(500).json(error)
    }
}

const login = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const USER = await User.findOne({where: {username: request.body.username, password: request.body.password}}) //TODO Add cryptography
        console.log(USER)
        if(USER) {
            var token = jwt.sign({ id: USER?.get("id") }, process.env.SECRET_KEY || "", {
                expiresIn: 604800 // 7 giorni
            });
        return response.status(200).json({"user": USER, "token": token})
        }else{
            return response.status(401).json({"message": "Username o password non corretti"})
        }
        if (!USER) {
            return response.status(401).json({message: "Invalid Credentials"})
        }
        const token = jwt.sign({ id: USER?.get("id") }, process.env.SECRET_KEY || "", {expiresIn: "1h"})
        return response.status(200).json({token})
    } catch (error) {
        return response.status(500).json(error)
    }
}

const controller = {
    getAll,
    getById,
    create,
    updateById,
    deleteById,
    login
}

export default controller;