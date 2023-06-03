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
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAdmin = exports.checkToken = void 0;
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
