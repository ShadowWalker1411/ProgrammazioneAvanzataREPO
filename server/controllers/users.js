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
// Funzione per ottenere un singolo utente per ID
const getOneById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const USER = yield users_1.default.findByPk(id);
    return USER;
});
// Funzione per ottenere i crediti di un utente per ID
const getCreds = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const USER = yield users_1.default.findByPk(id);
    return parseFloat(USER.credits);
});
// Funzione per ottenere tutti gli utenti
const getAll = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ALL = yield users_1.default.findAll();
        return response.status(200).json(ALL);
    }
    catch (error) {
        return response.status(500).json(error);
    }
});
// Funzione per ottenere un utente per ID
const getById = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const USER = yield getOneById(parseInt(request.params.id));
        return response.status(200).json(USER);
    }
    catch (error) {
        return response.status(500).json(error);
    }
});
// Funzione per creare un nuovo utente
const create = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validazione dei dati della richiesta
        const { error, value } = createUserSchema.validate(request.body);
        if (error) {
            return response.status(400).json({ error: error.details });
        }
        // Hash della password
        const hashedPassword = bcrypt_1.default.hashSync(value.password, 8);
        // Creazione dell'oggetto USER_MODEL per l'utente
        const USER_MODEL = {
            username: value.username,
            email: value.email,
            password: hashedPassword,
            admin: value.admin || false
        };
        try {
            // Creazione dell'utente nel database
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
// Funzione per aggiornare un utente per ID
const updateById = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validazione dei dati della richiesta
        const { error, value } = updateUserSchema.validate(request.body);
        if (error) {
            return response.status(400).json({ message: error.details[0].message });
        }
        // Creazione dell'oggetto USER_MODEL per l'aggiornamento dell'utente
        const USER_MODEL = {
            username: value.username || undefined,
            email: value.email || undefined,
            password: value.password ? bcrypt_1.default.hashSync(value.password, 8) : undefined
        };
        try {
            // Aggiornamento dell'utente nel database
            const NROWS = yield users_1.default.update(USER_MODEL, { where: { uid: request.params.id } });
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
// Funzione per eliminare un utente per ID
const deleteById = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Eliminazione dell'utente dal database
        const NROWS = yield users_1.default.destroy({ where: { uid: request.params.id } });
        return response.status(200).json(NROWS);
    }
    catch (error) {
        return response.status(500).json(error);
    }
});
// Funzione per il login dell'utente
const login = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Trova l'utente nel database utilizzando il nome utente fornito nella richiesta
        const USER = yield users_1.default.findOne({ where: { username: request.body.username } });
        // Confronta la password fornita nella richiesta con la password hashata dell'utente nel database
        if (bcrypt_1.default.compareSync(request.body.password, USER === null || USER === void 0 ? void 0 : USER.getDataValue('password'))) {
            // Genera un token di accesso utilizzando l'ID dell'utente e la chiave segreta
            const token = jsonwebtoken_1.default.sign({ id: USER === null || USER === void 0 ? void 0 : USER.get("uid") }, process.env.SECRET_KEY || "", { expiresIn: "1h" });
            // Restituisci il token come risposta JSON con lo stato 200
            return response.status(200).json({ token });
        }
        else {
            // La password non corrisponde, restituisci un messaggio di errore con lo stato 401
            return response.status(401).json({ message: "Invalid Credentials" });
        }
    }
    catch (error) {
        // Si è verificato un errore, restituisci una risposta di errore con lo stato 500
        return response.status(500).json(error);
    }
});
// Funzione per ottenere i crediti di un utente
const getCredits = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Ottieni i crediti dell'utente utilizzando l'ID fornito nella richiesta
        const credits = yield getCreds(parseInt(request.uid));
        // Restituisci i crediti come risposta JSON con lo stato 200
        return response.status(200).json({ "credits": credits });
    }
    catch (error) {
        // Si è verificato un errore, restituisci una risposta di errore con lo stato 500
        return response.status(500).json(error);
    }
});
// Funzione per aggiungere crediti a un utente
const addCredits = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validazione dei dati della richiesta
        const { error, value } = addCreditsSchema.validate(request.body);
        if (error) {
            return response.status(400).json({ message: error.details[0].message });
        }
        // Trova l'utente nel database utilizzando l'email fornita nella richiesta
        const USER = yield users_1.default.findOne({ where: { email: request.params.email } });
        if (USER) {
            const currentCredits = parseFloat(USER.credits);
            const addedCredits = parseFloat(value.credits);
            const totalCredits = currentCredits + addedCredits;
            if (totalCredits > 5000) {
                // Il totale dei crediti non può superare 5000, restituisci un messaggio di errore con lo stato 400
                return response.status(400).json({ message: "Total credits cannot exceed 5000" });
            }
            const USER_MODEL = {
                credits: totalCredits
            };
            try {
                // Aggiorna i crediti dell'utente nel database
                const NROWS = yield users_1.default.update(USER_MODEL, { where: { email: request.params.email } });
                // Restituisci il numero di righe aggiornate come risposta JSON con lo stato 200
                return response.status(200).json(NROWS);
            }
            catch (error) {
                // Si è verificato un errore nell'aggiornamento dei crediti, restituisci una risposta di errore con lo stato 500
                return response.status(500).json(error);
            }
        }
        else {
            // L'utente non è stato trovato, restituisci un messaggio di errore con lo stato 404
            return response.status(404).json({ message: "User not found" });
        }
    }
    catch (error) {
        // Si è verificato un errore, restituisci una risposta di errore con lo stato 500
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
    admin: joi_1.default.boolean().optional()
});
const updateUserSchema = joi_1.default.object({
    username: joi_1.default.string().alphanum().min(3).max(15).optional(),
    email: joi_1.default.string().email().optional(),
    password: joi_1.default.string().min(6).optional(),
    admin: joi_1.default.boolean().optional()
});
const addCreditsSchema = joi_1.default.object({
    credits: joi_1.default.number().min(0).max(1000).optional(),
    // credits: Joi.number().integer().min(0).max(1000).optional(),
});
const usersController = {
    getAll,
    getById, getOneById,
    create,
    updateById,
    deleteById,
    login, getCredits, addCredits, getCreds
};
exports.default = usersController;
