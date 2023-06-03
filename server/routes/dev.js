"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middleware_1 = require("../middlewares/middleware");
const dev_1 = __importDefault(require("../controllers/dev"));
const router = express_1.default.Router();
const controller = new dev_1.default();
router.get('/version', middleware_1.checkToken, middleware_1.checkAdmin, controller.version);
exports.default = router;
