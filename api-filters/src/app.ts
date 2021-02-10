import express, {
    Application
} from 'express';
import 'dotenv/config';

import router from './routes/index';
import connDB from './db';

import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import * as swaggerDefinition from './swagger.json';

const port = process.env.PORT || 3900;

let swaggerOptions = {
    swaggerDefinition,
    apis: ['./routes/*.ts']
} as any;
let swaggerDoc = swaggerJsDoc(swaggerOptions);

const app: Application = express();
connDB();

// app.use(function (req, res, next) {
//     const url = req.headers.host;
//     console.log(url);
//     next()
// });
app.get('/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');;
    res.send(swaggerDoc)
})
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
app.use('/api/v1', router);

app.listen(port, () => console.log(`server running on ${port}...`))