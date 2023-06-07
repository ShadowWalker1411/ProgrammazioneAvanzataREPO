import Model from './../models/models';
import { Request, Response, NextFunction } from 'express';
import Joi, { Err } from 'joi';
import Dataset from '../models/datasets';
import multer from 'multer';
import axios from "axios";

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
        const MODEL = await getOneById(parseInt(request.params.id))
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
}

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
}

const deleteById = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const NROWS = await Model.destroy({where: {UID: request.params.id}})
        return response.status(200).json(NROWS)
    } catch (error) {
        return response.status(500).json(error)
    }
}



const uploadFile = async (request: Request, response: Response, next: NextFunction) => {
    const storage = multer.diskStorage({
        destination: (request, file, cb) => {
            cb(null, '/models')
        },
        filename: (request, file, cb) => {
            const mid = request.params.id
            const uid = (request as any).UID
            const ext = file.originalname.split('.').pop()
            const filename = file.fieldname + '-' + mid + '-' + uid + '.' + ext

            const filePath = '/models/' + filename
            const fs = require('fs')
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath) // Elimina il file esistente
            }

            cb(null, filename)
        }
    })

    const upload = multer({ storage })
    upload.single('file')(request, response, (err: any) => {
        if (err instanceof multer.MulterError) {
            return response.status(400).json({ error: err.message })
        } else if (err) {
            return response.status(500).json({ error1: err.message })
        }
        return response.status(200).json({ message: 'Upload successful' })
    })
}

const uploadFile = async (request: Request, response: Response, next: NextFunction) => {
    const storage = multer.diskStorage({
        destination: (request, file, cb) => {
            cb(null, '/models')
        },
        filename: (request, file, cb) => {
            const mid = request.params.id
            const uid = (request as any).UID
            const ext = file.originalname.split('.').pop()
            const filename = file.fieldname + '-' + mid + '-' + uid + '.' + ext

            const filePath = '/models/' + filename
            const fs = require('fs')
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath) // Elimina il file esistente
            }

            cb(null, filename)
        }
    })

    const upload = multer({ storage });
    upload.single('file')(request, response, (err) => {
        if (err instanceof multer.MulterError) {
            return response.status(400).json({ error: err.message });
        } else if (err) {
            return response.status(500).json({ error: err.message });
        }
        return response.status(200).json({ message: 'Upload successful' });
    });
};

const inference = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const MODEL = await getOneById(parseInt(request.params.id))
        const DATASET = await Dataset.findByPk((MODEL as any).datasetUID)
        /*amqp.connect('amqp://admin:admin@rabbitmq:' + process.env.RABBITMQ_PORT, function(error, connection) {
            if (error) {
                return response.status(500).json(error)
            }
            connection.createChannel(function(error, channel) {
                if (error) {
                    return response.status(500).json(error)
                }
                var queue = "queue"
                var msg = "Hello World!"
                channel.assertQueue(queue, { durable: false })
                channel.sendToQueue(queue, Buffer.from(msg))
                response.status(200).json( { "MODEL": MODEL, "DATASET": DATASET, "MESSAGE": msg} )
            })
        })*/
        const resp = await axios.get("http://producer:5000/start-job/4", { params: {} })
        return response.status(200).json({ "MODEL": MODEL, "DATASET": DATASET, "MESSAGE": "Inference request sent successfully", "JOB_ID": resp.data.id })
    } catch (error) {
        return response.status(500).json(error)
    }
}

const status = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const job_id = request.params.job_id
        const resp = await axios.get("http://producer:5000/status/" + job_id.toString(), { params: {} });
        return response.status(200).json({ "STATUS": resp.data.status, "JOB_ID": job_id })
    } catch (error) {
        return response.status(500).json(error)
    }
}

const result = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const job_id = request.params.job_id
        const resp = await axios.get("http://producer:5000/result/" + job_id.toString(), { params: {} })
        return response.status(200).json({ "RESULT": resp.data.result, "JOB_ID": job_id })
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

const modelsController = {
    getAll,
    getById, getOneById,
    create,
    updateById,
    deleteById,
    getAllByUserUID,
    getAllMine,
    uploadFile,
    inference, status, result
}

export default modelsController;