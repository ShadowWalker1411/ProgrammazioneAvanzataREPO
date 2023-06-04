"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const datasets_1 = __importDefault(require("../controllers/datasets"));
const datasets_2 = require("../middlewares/datasets");
const users_1 = require("../middlewares/users");
const router = express_1.default.Router();
router
    .get('/all', users_1.checkAuth, users_1.checkAdmin, datasets_1.default.getAll)
    .get('/', datasets_1.default.getAllMine)
    .get('/:id', users_1.checkAuth, datasets_2.checkOwner, datasets_1.default.getById)
    .post('/', users_1.checkAuth, datasets_1.default.create)
    .put('/:id', users_1.checkAuth, datasets_2.checkOwner, datasets_1.default.updateById)
    .delete('/:id', users_1.checkAuth, datasets_2.checkOwner, datasets_1.default.deleteById);
exports.default = router;
