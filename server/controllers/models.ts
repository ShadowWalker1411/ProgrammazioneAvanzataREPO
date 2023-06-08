import Model from './../models/models'
import usersController from './users'
import { Request, Response, NextFunction } from 'express'
import Joi, { Err } from 'joi'
import Dataset from '../models/datasets'
import multer, { MulterError } from 'multer'
import axios from "axios"
import { StatusCodes } from 'http-status-codes';

// Funzione per ottenere un modello dal database utilizzando l'ID
const getOneById = async (id: number) => {
    const MODEL = await Model.findByPk(id)
    return MODEL
}

// Funzione per ottenere tutti i modelli associati a un determinato userUID
const getAllByUserUID = async (userUID: number) => {
    const MODEL = await Model.findAll({ where: { userUID: userUID } })
    return MODEL
}

// Funzione per rimuovere 5 crediti da un utente specifico
const removeCredits = async (userUID: number) => {
    const user = await usersController.getOneById(userUID) as any
    const credits = parseFloat((user.getDataValue('credits') - 5).toFixed(1))
    user.setDataValue('credits', credits)
    await user.save()
}

// Funzione per ottenere tutti i modelli dal database
const getAll = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const ALL = await Model.findAll()
        return response.status(StatusCodes.OK).json(ALL)
    } catch (error) {
        return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
    }
}

// Funzione per ottenere tutti i modelli associati all'UID dell'utente corrente
const getAllMine = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const MODEL = await getAllByUserUID((request as any).uid)
        return response.status(StatusCodes.OK).json(MODEL)
    } catch (error) {
        return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
    }
}

// Funzione per ottenere un modello dal database utilizzando l'ID fornito
const getById = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const MODEL = await getOneById(parseInt(request.params.id))
        return response.status(StatusCodes.OK).json(MODEL)
    } catch (error) {
        return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
    }
}

// Funzione per creare un nuovo modello nel database
const create = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const { error, value } = createModelSchema.validate(request.body)
        if (error) {
            return response.status(StatusCodes.BAD_REQUEST).json({ error: error.details })
        }
        const MODEL_MODEL = {
            name: value.name,
            datasetUID: value.datasetUID,
            userUID: (request as any).uid,
        }
        const dataset=await Dataset.findByPk(value.datasetUID)
        if(dataset){
            try {
                const MODEL = await Model.create(MODEL_MODEL)
                return response.status(StatusCodes.CREATED).json(MODEL)
            } catch (error) {
                return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
            }
        }else{
            return response.status(StatusCodes.NOT_FOUND).json({ error: 'Dataset not found' })
        }
    } catch (error) {
        return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
    }
}

// Funzione per aggiornare un modello nel database utilizzando l'ID fornito
const updateById = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const { error, value } = updateModelSchema.validate(request.body)
        if (error) {
            return response.status(StatusCodes.BAD_REQUEST).json({ message: error.details[0].message })
        }
        const MODEL_MODEL = {
            name: value.name,
            datasetUID: value.datasetUID
        }
        const dataset=await Dataset.findByPk(value.datasetUID)
        if(dataset){
            try {
                const NROWS = await Model.update(MODEL_MODEL, { where: { uid: request.params.id } })
                return response.status(StatusCodes.OK).json(NROWS)
            } catch (error) {
                return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
            }
        }else{
            return response.status(StatusCodes.NOT_FOUND).json({ error: 'Dataset not found' })
        }
    } catch (error) {
        return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
    }
}

// Funzione per eliminare un modello dal database utilizzando l'ID fornito
const deleteById = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const NROWS = await Model.destroy({where: {uid: request.params.id}})
        return response.status(StatusCodes.OK).json(NROWS)
    } catch (error) {
        return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
    }
}

// Funzione per caricare un file del modello
const uploadFile = async (request: Request, response: Response, next: NextFunction) => {
    const storage = multer.diskStorage({
        destination: (request, file, cb) => {
            cb(null, '/models')
        },
        filename: (request, file, cb) => {
            const mid = request.params.id
            const uid = (request as any).uid
            const ext = file.originalname.split('.').pop()

            if (ext !== 'py') {
                const error = new Error('Estensione file non valida. Sono consentiti solo file .py')
                return cb(error, '')
            }

            const filename = 'file-' + mid + '-' + uid + '.' + ext
            cb(null, filename)
        },
    })

    const upload = multer({ storage }).single('file')

    upload(request, response, async (err: any) => {
        if (err instanceof multer.MulterError) {
            return response.status(StatusCodes.BAD_REQUEST).json({ error: err.message })
        } else if (err) {
            return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message })
        }

        // Verifica se c'è un file da caricare
        if (!request.file) {
            return response.status(StatusCodes.BAD_REQUEST).json({ error: 'Nessun file da caricare' })
        }

        return response.status(StatusCodes.OK).json({ message: 'Caricamento effettuato con successo' })
    })
}


// Funzione per avviare l'inferenza di un modello
const inference = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const MODEL = await getOneById(parseInt(request.params.id))
        const DATASET = await Dataset.findByPk((MODEL as any).datasetUID)
        /*amqp.connect('amqp://admin:admin@rabbitmq:' + process.env.RABBITMQ_PORT, function(error, connection) {
            if (error) {
                return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
            }
            connection.createChannel(function(error, channel) {
                if (error) {
                    return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
                }
                var queue = "queue"
                var msg = "Hello World!"
                channel.assertQueue(queue, { durable: false })
                channel.sendToQueue(queue, Buffer.from(msg))
                response.status(StatusCodes.OK).json( { "MODEL": MODEL, "DATASET": DATASET, "MESSAGE": msg} )
            })
        })*/
        const resp = await axios.get("http://producer:5000/start-job/0", { params: {} })
        await removeCredits((request as any).uid)
        return response.status(StatusCodes.OK).json({ "model": MODEL, "dataset": DATASET, "message": "Inference request sent successfully", "job_id": resp.data.id })
    } catch (error) {
        return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
    }
}

// Funzione per ottenere lo stato di un job di inferenza
const status = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const job_id = request.params.job_id
        const resp = await axios.get("http://producer:5000/status/" + job_id.toString(), { params: {} })
        return response.status(StatusCodes.OK).json({ "status": resp.data.status, "job_id": job_id })
    } catch (error) {
        return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
    }
}
// Funzione per ottenere il risultato di un job di inferenza
const result = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const job_id = request.params.job_id
        const resp = await axios.get("http://producer:5000/result/" + job_id.toString(), { params: {} })
        return response.status(StatusCodes.OK).json({ "result": resp.data.result as [number, number][], "job_id": job_id })
    } catch (error) {
        return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
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

export default modelsController