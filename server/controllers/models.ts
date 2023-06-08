import Model from './../models/models';
import usersController from './users';
import { Request, Response, NextFunction } from 'express';
import Joi, { Err } from 'joi';
import Dataset from '../models/datasets';
import multer, { MulterError } from 'multer';
import axios from "axios";

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
    user.setDataValue('credits', credits);
    await user.save();
}

// Funzione per ottenere tutti i modelli dal database
const getAll = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const ALL = await Model.findAll()
        return response.status(200).json(ALL)
    } catch (error) {
        return response.status(500).json(error)
    }
}

// Funzione per ottenere tutti i modelli associati all'UID dell'utente corrente
const getAllMine = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const MODEL = await getAllByUserUID((request as any).UID)
        return response.status(200).json(MODEL)
    } catch (error) {
        return response.status(500).json(error)
    }
}

// Funzione per ottenere un modello dal database utilizzando l'ID fornito
const getById = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const MODEL = await getOneById(parseInt(request.params.id))
        return response.status(200).json(MODEL)
    } catch (error) {
        return response.status(500).json(error)
    }
}

// Funzione per creare un nuovo modello nel database
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

// Funzione per aggiornare un modello nel database utilizzando l'ID fornito
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

// Funzione per eliminare un modello dal database utilizzando l'ID fornito
const deleteById = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const NROWS = await Model.destroy({where: {UID: request.params.id}})
        return response.status(200).json(NROWS)
    } catch (error) {
        return response.status(500).json(error)
    }
}

// Funzione per caricare un file del modello
const uploadFile = async (request: Request, response: Response, next: NextFunction) => {
    const storage = multer.diskStorage({
        destination: (request, file, cb) => {
            cb(null, '/models');
        },
        filename: (request, file, cb) => {
            const mid = request.params.id
            const uid = (request as any).UID
            const ext = file.originalname.split('.').pop()

            if (ext !== 'py') {
                const error = new Error('Estensione file non valida. Sono consentiti solo file .py')
                return cb(error, '')
            }

            const filename = 'file-' + mid + '-' + uid + '.' + ext;
            cb(null, filename)
        },
    });

    const upload = multer({ storage }).single('file');

    upload(request, response, async (err: any) => {
        if (err instanceof multer.MulterError) {
            return response.status(400).json({ error: err.message });
        } else if (err) {
            return response.status(500).json({ error: err.message });
        }

        // Verifica se c'è un file da caricare
        if (!request.file) {
            return response.status(400).json({ error: 'Nessun file da caricare' })
        }

        return response.status(200).json({ message: 'Caricamento effettuato con successo' })
    });
};


// Funzione per avviare l'inferenza di un modello
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
        await removeCredits((request as any).UID)
        return response.status(200).json({ "MODEL": MODEL, "DATASET": DATASET, "MESSAGE": "Inference request sent successfully", "JOB_ID": resp.data.id })
    } catch (error) {
        return response.status(500).json(error)
    }
}

// Funzione per ottenere lo stato di un job di inferenza
const status = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const job_id = request.params.job_id
        const resp = await axios.get("http://producer:5000/status/" + job_id.toString(), { params: {} });
        return response.status(200).json({ "STATUS": resp.data.status, "JOB_ID": job_id })
    } catch (error) {
        return response.status(500).json(error)
    }
}
// Funzione per ottenere il risultato di un job di inferenza
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