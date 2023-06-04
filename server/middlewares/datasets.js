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
const datasets_1 = __importDefault(require("../controllers/datasets"));
const checkOwner = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Checking owner");
    const datasetUID = (request.method === 'POST') ? request.body.UID : request.params.UID;
    const dataset = yield datasets_1.default.getOneById(datasetUID);
    if (!dataset) {
        return response.status(404).json({ message: 'Dataset not found' });
    }
    if (dataset.userUID === datasetUID) {
        next();
    }
    else {
        response.status(403).json({
            message: 'You are not the owner of this dataset'
        });
    }
});
exports.checkOwner = checkOwner;
