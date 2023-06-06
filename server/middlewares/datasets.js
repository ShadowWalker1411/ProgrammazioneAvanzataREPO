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
exports.checkOwner = exports.checkAuth = void 0;
const datasets_1 = __importDefault(require("../controllers/datasets"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/*const checkOwner = async (request: Request, response: Response, next: NextFunction) => {
    console.log("Checking owner")
    const datasetUID = (request.method === 'POST') ? request.body.id : request.params.id;
    const dataset = await controller.getOneById(datasetUID)
    console.log(datasetUID)
    if (!dataset) {
        return response.status(404).json({ message: 'Dataset not found' })
    }
    const userUID = (request as any).UID
    if ((dataset as any).userUID == userUID) {
        next()
    } else {
        response.status(403).json({
            message: 'You are not the owner of this dataset'
        })
    }
}*/
const checkOwner = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Checking owner");
    const datasetUID = request.params.id; // Utilizza request.params.id per recuperare l'ID del dataset
    const dataset = yield datasets_1.default.getOneById(parseInt(datasetUID));
    console.log(datasetUID);
    if (!dataset) {
        return response.status(404).json({ message: 'Dataset not found' });
    }
    const userUID = request.UID;
    if (dataset.userUID == userUID) {
        next();
    }
    else {
        response.status(403).json({
            message: 'You are not the owner of this dataset'
        });
    }
});
exports.checkOwner = checkOwner;
const checkAuth = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log("Checking auth");
    const token = (_a = request.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY || "");
            request.UID = decoded.id;
            next();
        }
        catch (error) {
            response.status(401).send({ message: 'Token not valid' });
        }
    }
    else {
        response.status(401).send({ message: 'Token not provided' });
    }
});
exports.checkAuth = checkAuth;
