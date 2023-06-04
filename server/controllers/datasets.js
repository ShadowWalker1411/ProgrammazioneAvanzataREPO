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
const getOneById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const DATASET = yield datasets_1.default.findByPk(id);
    return DATASET;
});
// NEW
const getAllByUserUID = (userUID) => __awaiter(void 0, void 0, void 0, function* () {
    const DATASETS = yield datasets_1.default.findAll({ where: { userUID: userUID } });
    return DATASETS;
});
// NEW
const getUserUIDById = (UID) => __awaiter(void 0, void 0, void 0, function* () {
    const DATASET = yield datasets_1.default.findByPk(UID);
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
// NEW
const getAllMine = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const DATASETS = yield getAllByUserUID(request.UID);
        return response.status(200).json(DATASETS);
    }
    catch (error) {
        return response.status(500).json(error);
    }
});
const getById = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const DATASET = yield getOneById(parseInt(request.params.UID));
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
            const NROWS = yield datasets_1.default.update(DATSET_MODEL, { where: { id: request.params.UID } });
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
        const NROWS = yield datasets_1.default.destroy({ where: { id: request.params.UID } });
        return response.status(200).json(NROWS);
    }
    catch (error) {
        return response.status(500).json(error);
    }
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
};
exports.default = controller;
