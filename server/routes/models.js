"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const models_1 = __importDefault(require("../controllers/models"));
const models_2 = require("../middlewares/models");
const users_1 = require("../middlewares/users");
const router = express_1.default.Router();
router
    .get('/all', users_1.checkAuth, users_1.checkAdmin, models_1.default.getAll)
    .get('/', users_1.checkAuth, models_1.default.getAllMine)
    .get('/:id', users_1.checkAuth, models_2.checkOwner, models_1.default.getById)
    .post('/', users_1.checkAuth, models_1.default.create)
    .put('/:id', users_1.checkAuth, models_2.checkOwner, models_1.default.updateById)
    .delete('/:id', users_1.checkAuth, models_2.checkOwner, models_1.default.deleteById);
exports.default = router;
