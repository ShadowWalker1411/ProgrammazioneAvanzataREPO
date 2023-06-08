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
// Importazione dei moduli e delle librerie necessarie
const express_1 = __importDefault(require("express"));
const database_1 = __importDefault(require("./utils/database"));
const users_1 = __importDefault(require("./routes/users"));
const datasets_1 = __importDefault(require("./routes/datasets"));
const models_1 = __importDefault(require("./routes/models"));
// Creazione di un'istanza di Express
const app = (0, express_1.default)();
// Parsificazione del corpo delle richieste come JSON
app.use(express_1.default.json());
// Parsificazione dei dati codificati nell'URL
app.use(express_1.default.urlencoded({ extended: true }));
// Middleware per impostare gli header CORS
app.use((request, response, next) => {
    response.set('Access-Control-Allow-Origin', '*');
    response.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    next();
});
// Gestione della route per il percorso radice
app.get("/", (request, response) => {
    response.send("Ciao mondo!");
});
// Montaggio delle routes
app.use('/users', users_1.default);
app.use('/datasets', datasets_1.default);
app.use('/models', models_1.default);
// Funzione per avviare il server
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Sincronizzazione dei modelli Sequelize con il database
        yield database_1.default.sync({ alter: true });
        // Impostazione della porta
        const port = process.env.EXTERNAL_PORT || 3001;
        // Avvio del server
        app.listen(port, () => {
            console.log("Il server è in esecuzione sulla porta 3001");
        });
    }
    catch (error) {
        console.log(error);
    }
}))();
