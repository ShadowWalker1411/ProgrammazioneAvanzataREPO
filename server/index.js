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
const express_1 = __importDefault(require("express"));
const database_1 = __importDefault(require("./utils/database"));
const users_1 = __importDefault(require("./routes/users"));
const datasets_1 = __importDefault(require("./routes/datasets"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((request, response, next) => {
    response.set('Access-Control-Allow-Origin', '*');
    response.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    console.log("This is a middleware");
    next();
});
app.get("/", (request, response) => {
    response.send("Hello World");
});
app.use('/users', users_1.default);
app.use('/datasets', datasets_1.default);
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield database_1.default.sync({ alter: true });
        const port = process.env.EXTERNAL_PORT || 3001;
        app.listen(port, () => {
            console.log("Server is running on port 3001");
        });
    }
    catch (error) {
        console.log(error);
    }
}))();
