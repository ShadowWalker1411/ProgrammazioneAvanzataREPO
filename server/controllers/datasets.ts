import Dataset from './../models/datasets';
import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

const getOneById = async (id: number) => {
    const DATASET = await Dataset.findByPk(id)
    return DATASET
}

const getAllByUserUID = async (userUID: number) => {
    const DATASETS = await Dataset.findAll({ where: { userUID: userUID } })
    return DATASETS
}

const getAll = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const ALL = await Dataset.findAll()
        return response.status(200).json(ALL)
    } catch (error) {
        return response.status(500).json(error)
    }
}

const getAllMine = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const DATASETS = await getAllByUserUID(parseInt((request as any).UID))
        return response.status(200).json(DATASETS)
    } catch (error) {
        return response.status(500).json(error)
    }
}

const getById = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const DATASET = await getOneById(parseInt(request.params.id))
        return response.status(200).json(DATASET)
    } catch (error) {
        return response.status(500).json(error)
    }
}

const create = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const { error, value } = createDatasetSchema.validate(request.body)
        if (error) {
            return response.status(400).json({ error: error.details })
        }
        const DATSET_MODEL = {
            name: value.name,
            tags: value.tags,
            numClasses: value.numClasses,
            userUID: (request as any).UID
        }
        try {
            const DATASET = await Dataset.create(DATSET_MODEL)
            return response.status(201).json(DATASET)
        } catch (error) {
            return response.status(500).json(error)
        }
    } catch (error) {
        return response.status(500).json(error)
    }
};

const updateById = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const { error, value } = updateDatasetSchema.validate(request.body);
        if (error) {
            return response.status(400).json({ message: error.details[0].message })
        }
        const DATSET_MODEL = {
            name: value.name,
            tags: value.tags,
            numClasses: value.numClasses,
        }
        try {
            const NROWS = await Dataset.update(DATSET_MODEL, { where: { UID: request.params.id } })
            return response.status(200).json(NROWS)
        } catch (error) {
            return response.status(500).json(error)
        }
    } catch (error) {
        return response.status(500).json(error)
    }
};

const deleteById = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const NROWS = await Dataset.destroy({where: {UID: request.params.id}})
        return response.status(200).json(NROWS)
    } catch (error) {
        return response.status(500).json(error)
    }
}

const createDatasetSchema = Joi.object({
    name: Joi.string().alphanum().min(3).max(15).required(),
    tags: Joi.number().min(0).max(1023).required(),
    numClasses: Joi.number().min(0).max(255).required()
});


const updateDatasetSchema = Joi.object({
    name: Joi.string().alphanum().min(3).max(15).optional(),
    tags: Joi.number().min(0).max(1023).optional(),
    numClasses: Joi.number().min(0).max(255).optional()
});

const controller = {
    getAll, getAllMine,
    getById, getOneById, getAllByUserUID,
    create,
    updateById,
    deleteById,
}

export default controller;