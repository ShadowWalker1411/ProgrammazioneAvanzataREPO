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
exports.checkOwner = void 0;
const models_1 = __importDefault(require("../controllers/models"));
const checkOwner = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Checking owner");
    const modelUID = (request.method === 'POST') ? request.body.UID : request.params.UID;
    const userUID = request.UID;
    const model = yield models_1.default.getOneById(modelUID);
    if (!model) {
        return response.status(404).json({ message: 'modello non trovato' });
    }
    if (model.userUID == userUID) {
        next();
    }
    else {
        response.status(403).json({
            message: 'Non sei il proprietario di questo modello'
        });
    }
});
exports.checkOwner = checkOwner;
