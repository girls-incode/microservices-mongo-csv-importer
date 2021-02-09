"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const index_1 = __importDefault(require("./routes/index"));
const db_1 = __importDefault(require("./db"));
const app = express_1.default();
const port = process.env.PORT || 4000;
db_1.default();
app.use('/upload-csv', index_1.default);
app.listen(port, () => console.log(`server running on ${port}...`));
