import Model from './../models/models';
import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import Dataset from '../models/datasets';


const getOneById = async (id: number) => {
    const MODEL = await Model.findByPk(id)
    return MODEL
}

const getAllByUserUID = async (userUID: number) => {
    const MODEL = await Model.findAll({ where: { userUID: userUID } })
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

const getAllMine = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const MODEL = await getAllByUserUID((request as any).UID)
        return response.status(200).json(MODEL)
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
        const { error, value } = createModelSchema.validate(request.body)
        if (error) {
            return response.status(400).json({ error: error.details })
        }
        const MODEL_MODEL = {
            name: value.name,
            datasetUID: value.datasetUID,
            userUID: (request as any).UID,
        }
        const dataset=await Dataset.findByPk(value.datasetUID)
        if(dataset){
            try {
                const MODEL = await Model.create(MODEL_MODEL)
                return response.status(201).json(MODEL)
            } catch (error) {
                return response.status(500).json(error)
            }
        }else{
            return response.status(404).json({ error: 'Dataset not found' })
        }
    } catch (error) {
        return response.status(500).json(error)
    }
};

const updateById = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const { error, value } = updateModelSchema.validate(request.body)
        if (error) {
            return response.status(400).json({ message: error.details[0].message })
        }
        const MODEL_MODEL = {
            name: value.name,
            datasetUID: value.datasetUID
        }
        const dataset=await Dataset.findByPk(value.datasetUID)
        if(dataset){
            try {
                const NROWS = await Model.update(MODEL_MODEL, { where: { UID: request.params.id } })
                return response.status(200).json(NROWS)
            } catch (error) {
                return response.status(500).json(error)
            }
        }else{
            return response.status(404).json({ error: 'Dataset not found' })
        }
    } catch (error) {
        return response.status(500).json(error)
    }
};

const deleteById = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const NROWS = await Model.destroy({where: {UID: request.params.id}})
        return response.status(200).json(NROWS)
    } catch (error) {
        return response.status(500).json(error)
    }
}

const createModelSchema = Joi.object({
    name: Joi.string().alphanum().min(3).max(15).required(),
    datasetUID: Joi.number().required(),
})


const updateModelSchema = Joi.object({
    name: Joi.string().alphanum().min(3).max(15).optional(),
    datasetUID: Joi.number().optional(),
})

const controller = {
    getAll,
    getById, getOneById,
    create,
    updateById,
    deleteById,
    getAllByUserUID,
    getAllMine
}

export default controller;