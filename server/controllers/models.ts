import Model from './../models/models';
import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

const getOneById = async (id: number) => {
    const MODEL = await Model.findByPk(id)
    return MODEL
}

const getAll = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const ALL = await Model.findAll()
        return response.status(200).json(ALL)
    } catch (error) {
        return response.status(500).json(error)
    }
}

const getById = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const MODEL = await getOneById(parseInt(request.params.UID))
        return response.status(200).json(MODEL)
    } catch (error) {
        return response.status(500).json(error)
    }
}

const create = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const { error, value } = createModelSchema.validate(request.body);
        if (error) {
            return response.status(400).json({ error: error.details });
        }
        const MODEL_MODEL = {
            name: value.name,
            datasetUID: value.datasetUID,
            userUID: value.userUID,
        };

        try {
            const MODEL = await Model.create(MODEL_MODEL);
            return response.status(201).json(MODEL);
        } catch (error) {
            return response.status(500).json(error);
        }
    } catch (error) {
        return response.status(500).json(error);
    }
};

const updateById = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const { error, value } = updateUserSchema.validate(request.body);
        if (error) {
            return response.status(400).json({ message: error.details[0].message });
        }
        const MODEL_MODEL = {
            name: value.name,
            datasetUID: value.datasetUID,
            userUID: value.userUID,
        };
        try {
            const NROWS = await Model.update(MODEL_MODEL, { where: { id: request.params.UID } });
            return response.status(200).json(NROWS);
        } catch (error) {
            return response.status(500).json(error);
        }
    } catch (error) {
        return response.status(500).json(error);
    }
};

const deleteById = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const NROWS = await Model.destroy({where: {id: request.params.UID}})
        return response.status(200).json(NROWS)
    } catch (error) {
        return response.status(500).json(error)
    }
}



const createModelSchema = Joi.object({
    name: Joi.string().alphanum().min(3).max(15).required(),
    datasetUID: Joi.string().email().required(),
});


const updateUserSchema = Joi.object({
    name: Joi.string().alphanum().min(3).max(15).optional(),
    datasetUID: Joi.string().email().optional(),
});

const controller = {
    getAll,
    getById, getOneById,
    create,
    updateById,
    deleteById,
    
}

export default controller;