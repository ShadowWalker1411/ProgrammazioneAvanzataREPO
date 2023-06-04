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
const users_1 = __importDefault(require("./../models/users"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const joi_1 = __importDefault(require("joi"));
const getOneById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const USER = yield users_1.default.findByPk(id);
    return USER;
});
const getAll = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ALL = yield users_1.default.findAll();
        return response.status(200).json(ALL);
    }
    catch (error) {
        return response.status(500).json(error);
    }
});
const getById = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const USER = yield getOneById(parseInt(request.params.UID));
        return response.status(200).json(USER);
    }
    catch (error) {
        return response.status(500).json(error);
    }
});
const create = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error, value } = createUserSchema.validate(request.body);
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
            const USER = yield users_1.default.create(USER_MODEL);
            return response.status(201).json(USER);
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
        const USER_MODEL = {
            username: value.username,
            email: value.email,
            password: value.password ? bcrypt_1.default.hashSync(value.password, 8) : undefined,
        };
        try {
            const NROWS = yield users_1.default.update(USER_MODEL, { where: { id: request.params.UID } });
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
        const NROWS = yield users_1.default.destroy({ where: { id: request.params.UID } });
        return response.status(200).json(NROWS);
    }
    catch (error) {
        return response.status(500).json(error);
    }
});
const login = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const USER = yield users_1.default.findOne({ where: { username: request.body.username } });
        console.log(USER === null || USER === void 0 ? void 0 : USER.getDataValue('password'));
        console.log(request.body.password);
        if (bcrypt_1.default.compareSync(request.body.password, USER === null || USER === void 0 ? void 0 : USER.getDataValue('password'))) {
            const token = jsonwebtoken_1.default.sign({ id: USER === null || USER === void 0 ? void 0 : USER.get("UID") }, process.env.SECRET_KEY || "", { expiresIn: "1h" });
            return response.status(200).json({ token });
        }
        else {
            return response.status(401).json({ message: "Invalid Credentials" });
        }
    }
    catch (error) {
        return response.status(500).json(error);
    }
});
const createUserSchema = joi_1.default.object({
    username: joi_1.default.string().alphanum().min(3).max(15).required()
        .messages({
        'string.alphanum': 'Il nome utente può contenere solo caratteri alfanumerici',
        'string.min': 'Il nome utente deve contenere almeno 3 caratteri',
        'string.max': 'Il nome utente può contenere al massimo 15 caratteri',
        'any.required': 'Il nome utente è obbligatorio',
    }),
    email: joi_1.default.string().email().required()
        .messages({
        'string.email': 'Inserisci un indirizzo email valido',
        'any.required': 'L\'indirizzo email è obbligatorio',
    }),
    password: joi_1.default.string().min(6).required()
        .messages({
        'string.min': 'La password deve avere almeno 6 caratteri',
        'any.required': 'La password è obbligatoria',
    }),
});
const updateUserSchema = joi_1.default.object({
    username: joi_1.default.string().alphanum().min(3).max(15).optional(),
    email: joi_1.default.string().email().optional(),
    password: joi_1.default.string().min(6).optional(),
});
const controller = {
    getAll,
    getById, getOneById,
    create,
    updateById,
    deleteById,
    login
};
exports.default = controller;
