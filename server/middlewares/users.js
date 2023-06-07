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
exports.CreditDeduction = exports.checkToken = exports.checkOwner = exports.checkAuth = exports.checkAdmin = void 0;
const users_1 = __importDefault(require("../controllers/users"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const checkAdmin = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Checking admin");
    const USER = yield users_1.default.getOneById(parseInt(request.UID));
    if ((USER === null || USER === void 0 ? void 0 : USER.get("admin")) === true) {
        next();
    }
    else {
        response.status(401).send("Unauthorized");
    }
});
exports.checkAdmin = checkAdmin;
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
const checkOwner = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    console.log("Checking owner");
    const token = (_b = request.headers.authorization) === null || _b === void 0 ? void 0 : _b.split(" ")[1];
    if (token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY || "");
            const UID = (request.method === 'POST') ? request.body.id : request.params.id;
            if (UID == decoded.id) {
                request.UID = decoded.id;
                next();
            }
            else {
                response.status(401).send("Unauthorized");
            }
        }
        catch (error) {
            response.status(401).send({ message: 'Token not valid' });
        }
    }
    else {
        response.status(401).send({ message: 'Token not provided' });
    }
});
exports.checkOwner = checkOwner;
const checkToken = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Checking token");
    const creds = yield users_1.default.getCreds(request.UID);
    if (creds > 0) {
        next();
    }
    else {
        response.status(401).send({ message: 'Not enough tokens' });
    }
});
exports.checkToken = checkToken;
const CreditDeduction = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield users_1.default.getOneById(parseInt(request.UID));
    if (user) {
        console.log(user.getDataValue('credits'));
        const currentCredits = user.getDataValue('credits');
        const newCredits = currentCredits - 0.1;
        user.setDataValue('credits', newCredits);
        yield user.save();
        console.log(user.getDataValue('credits'));
        next();
    }
    else {
        return response.status(404).json({ message: 'User not found' });
    }
});
exports.CreditDeduction = CreditDeduction;
