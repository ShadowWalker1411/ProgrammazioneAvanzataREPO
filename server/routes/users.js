"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_1 = __importDefault(require("../controllers/users"));
const middleware_1 = require("../middlewares/middleware");
const router = express_1.default.Router();
router
    .get('/', users_1.default.getAll)
    .get('/:id', middleware_1.checkAuth, middleware_1.checkAdmin, users_1.default.getById)
    .post('/', users_1.default.create)
    .put('/:id', middleware_1.checkAuth, users_1.default.updateById)
    .delete('/:id', middleware_1.checkAuth, users_1.default.deleteById);
router.post('/login', users_1.default.login);
exports.default = router;
