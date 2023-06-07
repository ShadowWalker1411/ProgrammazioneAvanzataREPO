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
const datasets_1 = __importDefault(require("./../models/datasets"));
const joi_1 = __importDefault(require("joi"));
const multer_1 = __importDefault(require("multer"));
const adm_zip_1 = __importDefault(require("adm-zip"));
const fs_1 = __importDefault(require("fs"));
const getOneById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const DATASET = yield datasets_1.default.findByPk(id);
    return DATASET;
});
const getAllByUserUID = (userUID) => __awaiter(void 0, void 0, void 0, function* () {
    const DATASETS = yield datasets_1.default.findAll({ where: { userUID: userUID } });
    return DATASETS;
});
const getAll = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ALL = yield datasets_1.default.findAll();
        return response.status(200).json(ALL);
    }
    catch (error) {
        return response.status(500).json(error);
    }
});
const getAllMine = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const DATASETS = yield getAllByUserUID(parseInt(request.UID));
        return response.status(200).json(DATASETS);
    }
    catch (error) {
        return response.status(500).json(error);
    }
});
const getById = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const DATASET = yield getOneById(parseInt(request.params.id));
        return response.status(200).json(DATASET);
    }
    catch (error) {
        return response.status(500).json(error);
    }
});
const create = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error, value } = createDatasetSchema.validate(request.body);
        if (error) {
            return response.status(400).json({ error: error.details });
        }
        const DATSET_MODEL = {
            name: value.name,
            tags: value.tags,
            numClasses: value.numClasses,
            userUID: request.UID
        };
        try {
            const DATASET = yield datasets_1.default.create(DATSET_MODEL);
            return response.status(201).json(DATASET);
        }
        catch (error) {
            return response.status(500).json(error);
        }
    }
    catch (error) {
        return response.status(500).json(error);
    }
});
const updateById = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error, value } = updateDatasetSchema.validate(request.body);
        if (error) {
            return response.status(400).json({ message: error.details[0].message });
        }
        const DATSET_MODEL = {
            name: value.name,
            tags: value.tags,
            numClasses: value.numClasses,
        };
        try {
            const NROWS = yield datasets_1.default.update(DATSET_MODEL, { where: { UID: request.params.id } });
            return response.status(200).json(NROWS);
        }
        catch (error) {
            return response.status(500).json(error);
        }
    }
    catch (error) {
        return response.status(500).json(error);
    }
});
const deleteById = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const NROWS = yield datasets_1.default.destroy({ where: { UID: request.params.id } });
        return response.status(200).json(NROWS);
    }
    catch (error) {
        return response.status(500).json(error);
    }
});
const uploadImage = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    const storage = multer_1.default.diskStorage({
        destination: (request, file, cb) => {
            cb(null, '/images');
        },
        filename: (request, file, cb) => {
            const uid = request.UID;
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + '.' + file.mimetype.split('/')[1];
            const filename = file.fieldname + '-' + uid + '-' + uniqueSuffix;
            cb(null, filename);
        },
    });
    const upload = (0, multer_1.default)({ storage });
    upload.single('file')(request, response, (err) => {
        if (err instanceof multer_1.default.MulterError) {
            return response.status(400).json({ error: err.message });
        }
        else if (err) {
            return response.status(500).json({ error1: err.message }); //qualcosa è andato male
        }
        return response.status(200).json({ message: 'Upload successful' });
    });
});
const uploadImages = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    const storage = multer_1.default.diskStorage({
        destination: (request, file, cb) => {
            cb(null, '/images');
        },
        filename: (request, file, cb) => {
            const uid = request.UID;
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + '.' + file.mimetype.split('/')[1];
            const filename = file.fieldname + '-' + uid + '-' + uniqueSuffix;
            cb(null, filename);
        },
    });
    const uploads = (0, multer_1.default)({ storage });
    uploads.array('files')(request, response, (err) => {
        if (err instanceof multer_1.default.MulterError) {
            return response.status(400).json({ error: err.message });
        }
        else if (err) {
            return response.status(500).json({ error: err.message });
        }
        return response.status(200).json({ message: 'Upload successful' });
    });
});
const uploadZip = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    const storage = multer_1.default.memoryStorage(); //N.B prima usavamo disk, invece ora salvo temporanemante
    const uploads = (0, multer_1.default)({ storage }).any();
    uploads(request, response, (err) => __awaiter(void 0, void 0, void 0, function* () {
        if (err instanceof multer_1.default.MulterError) {
            return response.status(400).json({ error: err.message });
        }
        else if (err) {
            return response.status(500).json({ error: err.message });
        }
        //Controllo ci sia qualcosa da uploadare
        if (!request.files || request.files.length === 0) {
            return response.status(400).json({ error: 'No files uploaded' });
        }
        const uploadedFiles = [];
        // leggo 1 a 1 i file
        for (const file of request.files) {
            if (file.mimetype !== 'application/zip') {
                return response.status(400).json({ error: 'Invalid file format. Only zip files are allowed' });
            }
            const zip = new adm_zip_1.default(file.buffer);
            const zipEntries = zip.getEntries();
            // Leggo i singoli file nella zip
            for (const zipEntry of zipEntries) {
                // Extract the file name and extension
                const fileName = zipEntry.entryName.split('/').pop();
                if (!fileName) {
                    continue;
                }
                const fileExtension = fileName.split('.').pop();
                // rinomino i singoli file
                const uid = request.UID;
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                const newFileName = `file-${uid}-${uniqueSuffix}.${fileExtension}`;
                // salvo col nuovo nome
                const filePath = `/images/${newFileName}`;
                fs_1.default.writeFileSync(filePath, zipEntry.getData());
                uploadedFiles.push(filePath);
            }
        }
        return response.status(200).json({ message: 'Upload successful', files: uploadedFiles });
    }));
});
const createDatasetSchema = joi_1.default.object({
    name: joi_1.default.string().alphanum().min(3).max(15).required(),
    tags: joi_1.default.number().min(0).max(1023).required(),
    numClasses: joi_1.default.number().min(0).max(255).required()
});
const updateDatasetSchema = joi_1.default.object({
    name: joi_1.default.string().alphanum().min(3).max(15).optional(),
    tags: joi_1.default.number().min(0).max(1023).optional(),
    numClasses: joi_1.default.number().min(0).max(255).optional()
});
const controller = {
    getAll, getAllMine,
    getById, getOneById, getAllByUserUID,
    create,
    updateById,
    deleteById,
    uploadImage,
    uploadImages,
    uploadZip
};
exports.default = controller;
