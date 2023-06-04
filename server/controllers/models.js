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
const bcrypt_1 = __importDefault(require("bcrypt"));
const joi_1 = __importDefault(require("joi"));
const getOneById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const MODEL = yield models_1.default.findByPk(id);
    return MODEL;
});
const getAll = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ALL = yield models_1.default.findAll();
        return response.status(200).json(ALL);
    }
    catch (error) {
        return response.status(500).json(error);
    }
});
const getById = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const MODEL = yield getOneById(parseInt(request.params.UID));
        return response.status(200).json(MODEL);
    }
    catch (error) {
        return response.status(500).json(error);
    }
});
const create = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error, value } = createModelSchema.validate(request.body);
        if (error) {
            return response.status(400).json({ error: error.details });
        }
        const hashedPassword = bcrypt_1.default.hashSync(value.password, 8);
        const USER_MODEL = {
            username: value.username,
            email: value.email,
            password: hashedPassword,
        };
        try {
            const MODEL = yield models_1.default.create(USER_MODEL);
            return response.status(201).json(MODEL);
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
            const NROWS = yield models_1.default.update(MODEL_MODEL, { where: { id: request.params.UID } });
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
        const NROWS = yield models_1.default.destroy({ where: { id: request.params.UID } });
        return response.status(200).json(NROWS);
    }
    catch (error) {
        return response.status(500).json(error);
    }
});
const createModelSchema = joi_1.default.object({
    name: joi_1.default.string().alphanum().min(3).max(15).required(),
    datasetUID: joi_1.default.string().email().required(),
});
const updateUserSchema = joi_1.default.object({
    name: joi_1.default.string().alphanum().min(3).max(15).optional(),
    datasetUID: joi_1.default.string().email().optional(),
});
const controller = {
    getAll,
    getById, getOneById,
    create,
    updateById,
    deleteById,
};
exports.default = controller;
