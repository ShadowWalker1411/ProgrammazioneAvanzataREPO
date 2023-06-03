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
        const USER = yield getOneById(parseInt(request.params.id));
        return response.status(200).json(USER);
    }
    catch (error) {
        return response.status(500).json(error);
    }
});
const create = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const USER_MODEL = {
            username: request.body.username,
            email: request.body.email,
            password: bcrypt_1.default.hashSync(request.body.password, 8)
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
        const USER_MODEL = {
            username: request.body.username,
            email: request.body.email,
            password: bcrypt_1.default.hashSync(request.body.password, 8)
        };
        try {
            const NROWS = yield users_1.default.update(USER_MODEL, { where: { id: request.params.id } });
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
        const NROWS = yield users_1.default.destroy({ where: { id: request.params.id } });
        return response.status(200).json(NROWS);
    }
    catch (error) {
        return response.status(500).json(error);
    }
});
const login = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const USER = yield users_1.default.findOne({ where: { username: request.body.username, password: bcrypt_1.default.hashSync(request.body.password, 8) } });
        if (!USER) {
            return response.status(401).json({ message: "Invalid Credentials" });
        }
        const token = jsonwebtoken_1.default.sign({ id: USER === null || USER === void 0 ? void 0 : USER.get("id") }, process.env.SECRET_KEY || "", { expiresIn: "1h" });
        return response.status(200).json({ token });
    }
    catch (error) {
        return response.status(500).json(error);
    }
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
