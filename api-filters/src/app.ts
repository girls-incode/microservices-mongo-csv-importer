import express, {
    Application,
    NextFunction,
    Request,
    Response,
} from 'express';
import cors from 'cors';
import morgan from 'morgan';
// import fs from 'fs';
// import path from 'path';
import 'dotenv/config';
import connDB from './config/db';
import router from './routes/index';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import * as swaggerDefinition from './swagger.json';

const port = process.env.PORT || 3900;

let swaggerOptions = {
    swaggerDefinition,
    apis: ['**/*.ts']
} as any;
let swaggerDoc = swaggerJsDoc(swaggerOptions);

const app: Application = express();
connDB();

app.use(cors());

// let accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
// app.use(morgan('combined', { stream: accessLogStream }));
app.use(morgan('dev'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
app.use('/api/v1', router);

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    if (!error.statusCode) error.statusCode = 500;

    if (error.statusCode === 301) {
        return res.status(301).redirect('/not-found');
    }

    return res.status(error.statusCode).json({ message: error.toString() });
});

app.listen(port, () => console.log(`server running on ${port}...`))