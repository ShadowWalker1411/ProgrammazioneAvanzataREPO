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
exports.checkAuth = exports.checkAdmin = exports.checkToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const checkToken = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Checking token");
    if (request.query.token) {
        try {
            const parsedValue = parseInt(request.query.token, 10);
            if (isNaN(parsedValue)) {
                throw new Error('Invalid number');
            }
            if (parsedValue === 0) {
                response.status(401).send("Unauthorized");
            }
            next();
        }
        catch (error) {
            return response.status(400).send('Invalid token');
        }
    }
    else {
        return response.status(400).send('Invalid token');
    }
});
exports.checkToken = checkToken;
const checkAdmin = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Checking admin");
    next();
});
exports.checkAdmin = checkAdmin;
const checkAuth = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log("Checking authentication");
    const token = (_a = request.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY || "").toString();
            const decodedJSON = JSON.parse(decoded);
            console.log(decodedJSON);
            /*const id = request.params.id
            if (id === decodedJSON.id) {
                next()
            } else {
                response.status(401).send("Unauthorized")
            }*/
            next();
        }
        catch (error) {
            response.status(401).send({ message: 'Token not valid.' });
        }
    }
    else {
        response.status(401).send({ message: 'Token not provided.' });
    }
});
exports.checkAuth = checkAuth;
