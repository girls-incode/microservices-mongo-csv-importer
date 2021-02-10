"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const index_1 = __importDefault(require("./routes/index"));
const db_1 = __importDefault(require("./db"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const port = process.env.PORT || 3900;
let swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'Emssions API',
            description: 'Get emissions info',
            contact: {
                name: 'Violeta'
            },
            servers: ['http://localhost:4000']
        }
    },
    apis: ['app.js', 'routes/*.js']
};
let swaggerDocs = swagger_jsdoc_1.default(swaggerOptions);
const app = express_1.default();
db_1.default();
// app.use(function (req, res, next) {
//     const url = req.headers.host;
//     console.log(url);
//     next()
// });
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocs));
app.use('/api/v1', index_1.default);
app.listen(port, () => console.log(`server running on ${port}...`));
