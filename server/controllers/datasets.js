"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const users_1 = __importDefault(require("./users"));
const joi_1 = __importDefault(require("joi"));
const multer_1 = __importStar(require("multer"));
const adm_zip_1 = __importDefault(require("adm-zip"));
const fs_1 = __importDefault(require("fs"));
const http_status_codes_1 = require("http-status-codes");
const getOneById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const DATASET = yield datasets_1.default.findByPk(id);
    return DATASET;
});
const getAllByUseruid = (userUID) => __awaiter(void 0, void 0, void 0, function* () {
    const DATASETS = yield datasets_1.default.findAll({ where: { userUID: userUID } });
    return DATASETS;
});
const checkCredits = (userUID, numberOfFiles) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield users_1.default.getOneById(userUID);
    const currentCredits = parseFloat(user.getDataValue('credits').toFixed(1));
    if (currentCredits >= 0.1 * numberOfFiles) {
        return true;
    }
    else {
        return false;
    }
});
const removeCredits = (userUID, numberOfFiles) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield users_1.default.getOneById(userUID);
    const credits = parseFloat((user.getDataValue('credits') - 0.1 * numberOfFiles).toFixed(1));
    user.setDataValue('credits', credits);
    yield user.save();
});
const getAll = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ALL = yield datasets_1.default.findAll();
        return response.status(http_status_codes_1.StatusCodes.OK).json(ALL);
    }
    catch (error) {
        return response.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(error);
    }
});
const getAllMine = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const DATASETS = yield getAllByUseruid(parseInt(request.uid));
        return response.status(http_status_codes_1.StatusCodes.OK).json(DATASETS);
    }
    catch (error) {
        return response.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(error);
    }
});
const getById = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const DATASET = yield getOneById(parseInt(request.params.id));
        return response.status(http_status_codes_1.StatusCodes.OK).json(DATASET);
    }
    catch (error) {
        return response.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(error);
    }
});
const create = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error, value } = createDatasetSchema.validate(request.body);
        if (error) {
            return response.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ error: error.details });
        }
        const DATSET_MODEL = {
            name: value.name,
            tags: value.tags,
            numClasses: value.numClasses,
            userUID: request.uid
        };
        try {
            const DATASET = yield datasets_1.default.create(DATSET_MODEL);
            return response.status(http_status_codes_1.StatusCodes.CREATED).json(DATASET);
        }
        catch (error) {
            return response.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(error);
        }
    }
    catch (error) {
        return response.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(error);
    }
});
const updateById = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error, value } = updateDatasetSchema.validate(request.body);
        if (error) {
            return response.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ message: error.details[0].message });
        }
        const DATSET_MODEL = {
            name: value.name,
            tags: value.tags,
            numClasses: value.numClasses,
        };
        try {
            const NROWS = yield datasets_1.default.update(DATSET_MODEL, { where: { uid: request.params.id } });
            if (NROWS[0] === 0) {
                return response.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({ message: 'Dataset not found' });
            }
            const DATASET = yield datasets_1.default.findOne({ where: { uid: request.params.id } });
            return response.status(http_status_codes_1.StatusCodes.OK).json(DATASET);
        }
        catch (error) {
            return response.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(error);
        }
    }
    catch (error) {
        return response.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(error);
    }
});
const deleteById = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const DATASET = yield datasets_1.default.findOne({ where: { uid: request.params.id } });
        if (!DATASET) {
            return response.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({ message: 'Dataset not found' });
        }
        yield datasets_1.default.destroy({ where: { uid: request.params.id } });
        return response.status(http_status_codes_1.StatusCodes.OK).json(DATASET);
    }
    catch (error) {
        return response.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json(error);
    }
});
const uploadImage = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Verifica se l'utente ha abbastanza crediti
    if (yield checkCredits(request.uid, 1)) {
        const upload = (0, multer_1.default)({
            storage: multer_1.default.diskStorage({
                destination: (request, file, cb) => {
                    cb(null, '/images');
                },
                filename: (request, file, cb) => {
                    const uid = request.uid;
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + '.' + file.mimetype.split('/')[1];
                    const filename = file.fieldname + '-' + uid + '-' + uniqueSuffix;
                    cb(null, filename);
                },
            }),
            fileFilter: (request, file, cb) => {
                // Verifica se è un file di immagine
                if (file.mimetype.startsWith('image/')) {
                    cb(null, true);
                }
                else {
                    cb(new Error('The uploaded file is not an image.'));
                }
            },
        });
        upload.single('file')(request, response, (err) => __awaiter(void 0, void 0, void 0, function* () {
            if (err instanceof multer_1.MulterError) {
                return response.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ error: err.message });
            }
            else if (err) {
                return response.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
            }
            // Verifica se è stato fornito un file
            if (!(request.file instanceof Array) && !request.file) {
                return response.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ error: 'No file was provided.' });
            }
            // Rimuovi i crediti dall'utente dopo il caricamento
            yield removeCredits(request.uid, 1);
            return response.status(http_status_codes_1.StatusCodes.OK).json({ message: 'Upload completed successfully' });
        }));
    }
    else {
        return response.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ error: 'Insufficient credits' });
    }
});
const uploadImages = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // Verifica se l'utente ha abbastanza crediti
    if (yield checkCredits(request.uid, ((_a = request.files) === null || _a === void 0 ? void 0 : _a.length) || 0)) {
        // Controlla se ci sono file da caricare
        const storage = multer_1.default.diskStorage({
            destination: (request, file, cb) => {
                cb(null, '/images');
            },
            filename: (request, file, cb) => {
                const uid = request.uid;
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + '.' + file.mimetype.split('/')[1];
                const filename = file.fieldname + '-' + uid + '-' + uniqueSuffix;
                cb(null, filename);
            },
        });
        const uploads = (0, multer_1.default)({ storage,
            fileFilter: (request, file, cb) => {
                // Verifica se è un file di immagine
                if (file.mimetype.startsWith('image/')) {
                    cb(null, true);
                }
                else {
                    cb(new Error('The uploaded file are not an image.'));
                }
            }
        });
        uploads.array('files')(request, response, (err) => __awaiter(void 0, void 0, void 0, function* () {
            var _b;
            if (err instanceof multer_1.MulterError) {
                return response.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ error: err.message });
            }
            else if (err) {
                return response.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
            }
            if (!request.files || !(request.files instanceof Array)) {
                return response.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ error: 'No file was provided.' });
            }
            // Rimuovi i crediti dall'utente dopo il caricamento
            yield removeCredits(request.uid, ((_b = request.files) === null || _b === void 0 ? void 0 : _b.length) || 0);
            return response.status(http_status_codes_1.StatusCodes.OK).json({ message: 'Upload completed successfully' });
        }));
    }
    else {
        return response.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ error: 'Insufficient credits' });
    }
});
const uploadZip = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    const storage = multer_1.default.memoryStorage();
    const uploads = (0, multer_1.default)({ storage }).any();
    uploads(request, response, (err) => __awaiter(void 0, void 0, void 0, function* () {
        if (err instanceof multer_1.default.MulterError) {
            return response.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ error: err.message });
        }
        else if (err) {
            return response.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
        }
        // Verifica se ci sono file da caricare
        if (!request.files || request.files.length === 0) {
            return response.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ error: 'No file to upload' });
        }
        const uploadedFiles = [];
        // Itera su ogni file
        for (const file of request.files) {
            if (file.mimetype !== 'application/zip') {
                return response.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ error: 'Invalid file format. Only zip files are allowed' });
            }
            const zip = new adm_zip_1.default(file.buffer);
            const zipEntries = zip.getEntries();
            if (yield checkCredits(request.uid, zipEntries.length)) {
                // Itera su ogni file all'interno della zip
                for (const zipEntry of zipEntries) {
                    // Estrai il nome del file e l'estensione
                    const fileName = zipEntry.entryName.split('/').pop();
                    if (!fileName) {
                        continue;
                    }
                    const fileExtension = fileName.split('.').pop();
                    // Verifica se il file è un'immagine diversamente dalle singole immagini dove controllo il mimetype
                    const imageExtensions = ['jpg', 'jpeg', 'png'];
                    if (!fileExtension || !imageExtensions.includes(fileExtension.toLowerCase())) {
                        return response.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ error: 'Invalid file format. Only images are allowed within the zip' });
                    }
                    // Genera un nuovo nome per il file
                    const uid = request.uid;
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                    const newFileName = 'file-' + uid + '-' + uniqueSuffix + '.' + fileExtension;
                    // Salva il file con il nuovo nome
                    const filePath = '/images/' + newFileName;
                    fs_1.default.writeFileSync(filePath, zipEntry.getData());
                    uploadedFiles.push(filePath);
                }
            }
            else {
                return response.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ error: 'Insufficient credits' });
            }
        }
        yield removeCredits(request.uid, uploadedFiles.length);
        return response.status(http_status_codes_1.StatusCodes.OK).json({ message: 'Upload completed successfully', files: uploadedFiles });
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
const datasetsController = {
    getAll, getAllMine,
    getById, getOneById, getAllByUseruid,
    create,
    updateById,
    deleteById,
    uploadImage,
    uploadImages,
    uploadZip
};
exports.default = datasetsController;
