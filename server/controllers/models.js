"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = __importDefault(require("./../models/models"));
const users_1 = __importDefault(require("./users"));
const joi_1 = __importDefault(require("joi"));
const datasets_1 = __importDefault(require("../models/datasets"));
const multer_1 = __importDefault(require("multer"));
const axios_1 = __importDefault(require("axios"));
// Funzione per ottenere un modello dal database utilizzando l'ID
const getOneById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const MODEL = yield models_1.default.findByPk(id);
    return MODEL;
});
// Funzione per ottenere tutti i modelli associati a un determinato userUID
const getAllByUserUID = (userUID) => __awaiter(void 0, void 0, void 0, function* () {
    const MODEL = yield models_1.default.findAll({ where: { userUID: userUID } });
    return MODEL;
});
// Funzione per rimuovere 5 crediti da un utente specifico
const removeCredits = (userUID) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield users_1.default.getOneById(userUID);
    const credits = parseFloat((user.getDataValue('credits') - 5).toFixed(1));
    user.setDataValue('credits', credits);
    yield user.save();
});
// Funzione per ottenere tutti i modelli dal database
const getAll = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ALL = yield models_1.default.findAll();
        return response.status(200).json(ALL);
    }
    catch (error) {
        return response.status(500).json(error);
    }
});
// Funzione per ottenere tutti i modelli associati all'UID dell'utente corrente
const getAllMine = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const MODEL = yield getAllByUserUID(request.uid);
        return response.status(200).json(MODEL);
    }
    catch (error) {
        return response.status(500).json(error);
    }
});
// Funzione per ottenere un modello dal database utilizzando l'ID fornito
const getById = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const MODEL = yield getOneById(parseInt(request.params.id));
        return response.status(200).json(MODEL);
    }
    catch (error) {
        return response.status(500).json(error);
    }
});
// Funzione per creare un nuovo modello nel database
const create = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error, value } = createModelSchema.validate(request.body);
        if (error) {
            return response.status(400).json({ error: error.details });
        }
        const MODEL_MODEL = {
            name: value.name,
            datasetUID: value.datasetUID,
            userUID: request.uid,
        };
        const dataset = yield datasets_1.default.findByPk(value.datasetUID);
        if (dataset) {
            try {
                const MODEL = yield models_1.default.create(MODEL_MODEL);
                return response.status(201).json(MODEL);
            }
            catch (error) {
                return response.status(500).json(error);
            }
        }
        else {
            return response.status(404).json({ error: 'Dataset not found' });
        }
    }
    catch (error) {
        return response.status(500).json(error);
    }
});
// Funzione per aggiornare un modello nel database utilizzando l'ID fornito
const updateById = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error, value } = updateModelSchema.validate(request.body);
        if (error) {
            return response.status(400).json({ message: error.details[0].message });
        }
        const MODEL_MODEL = {
            name: value.name,
            datasetUID: value.datasetUID
        };
        const dataset = yield datasets_1.default.findByPk(value.datasetUID);
        if (dataset) {
            try {
                const NROWS = yield models_1.default.update(MODEL_MODEL, { where: { uid: request.params.id } });
                return response.status(200).json(NROWS);
            }
            catch (error) {
                return response.status(500).json(error);
            }
        }
        else {
            return response.status(404).json({ error: 'Dataset not found' });
        }
    }
    catch (error) {
        return response.status(500).json(error);
    }
});
// Funzione per eliminare un modello dal database utilizzando l'ID fornito
const deleteById = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const NROWS = yield models_1.default.destroy({ where: { uid: request.params.id } });
        return response.status(200).json(NROWS);
    }
    catch (error) {
        return response.status(500).json(error);
    }
});
// Funzione per caricare un file del modello
const uploadFile = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    const storage = multer_1.default.diskStorage({
        destination: (request, file, cb) => {
            cb(null, '/models');
        },
        filename: (request, file, cb) => {
            const mid = request.params.id;
            const uid = request.uid;
            const ext = file.originalname.split('.').pop();
            if (ext !== 'py') {
                const error = new Error('Estensione file non valida. Sono consentiti solo file .py');
                return cb(error, '');
            }
            const filename = 'file-' + mid + '-' + uid + '.' + ext;
            cb(null, filename);
        },
    });
    const upload = (0, multer_1.default)({ storage }).single('file');
    upload(request, response, (err) => __awaiter(void 0, void 0, void 0, function* () {
        if (err instanceof multer_1.default.MulterError) {
            return response.status(400).json({ error: err.message });
        }
        else if (err) {
            return response.status(500).json({ error: err.message });
        }
        // Verifica se c'è un file da caricare
        if (!request.file) {
            return response.status(400).json({ error: 'Nessun file da caricare' });
        }
        return response.status(200).json({ message: 'Caricamento effettuato con successo' });
    }));
});
// Funzione per avviare l'inferenza di un modello
const inference = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const MODEL = yield getOneById(parseInt(request.params.id));
        const DATASET = yield datasets_1.default.findByPk(MODEL.datasetUID);
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
        const resp = yield axios_1.default.get("http://producer:5000/start-job/4", { params: {} });
        yield removeCredits(request.uid);
        return response.status(200).json({ "Model": MODEL, "Dataset": DATASET, "Message": "Inference request sent successfully", "Job_Id": resp.data.id });
    }
    catch (error) {
        return response.status(500).json(error);
    }
});
// Funzione per ottenere lo stato di un job di inferenza
const status = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const job_id = request.params.job_id;
        const resp = yield axios_1.default.get("http://producer:5000/status/" + job_id.toString(), { params: {} });
        return response.status(200).json({ "Status": resp.data.status, "Job_Id": job_id });
    }
    catch (error) {
        return response.status(500).json(error);
    }
});
// Funzione per ottenere il risultato di un job di inferenza
const result = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const job_id = request.params.job_id;
        const resp = yield axios_1.default.get("http://producer:5000/result/" + job_id.toString(), { params: {} });
        return response.status(200).json({ "Result": resp.data.result, "Job_Id": job_id });
    }
    catch (error) {
        return response.status(500).json(error);
    }
});
const createModelSchema = joi_1.default.object({
    name: joi_1.default.string().alphanum().min(3).max(15).required(),
    datasetUID: joi_1.default.number().required(),
});
const updateModelSchema = joi_1.default.object({
    name: joi_1.default.string().alphanum().min(3).max(15).optional(),
    datasetUID: joi_1.default.number().optional(),
});
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
};
exports.default = modelsController;
