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
    .get('/all', datasets_2.checkAuth, users_1.checkAdmin, datasets_1.default.getAll)
    .get('/', datasets_2.checkAuth, datasets_1.default.getAllMine)
    .get('/:id', datasets_2.checkAuth, datasets_2.checkOwner, datasets_1.default.getById)
    .post('/', datasets_2.checkAuth, datasets_1.default.create)
    .put('/:id', datasets_2.checkAuth, datasets_2.checkOwner, datasets_1.default.updateById)
    .delete('/:id', datasets_2.checkAuth, datasets_2.checkOwner, datasets_1.default.deleteById)
    .post('/image/:id', datasets_2.checkAuth, datasets_2.checkOwner, datasets_1.default.uploadImage)
    .post('/images/:id', datasets_2.checkAuth, datasets_2.checkOwner, datasets_1.default.uploadImages)
    .post('/zip/:id', datasets_2.checkAuth, datasets_2.checkOwner, users_1.CreditDeduction, datasets_1.default.uploadZip);
exports.default = router;
