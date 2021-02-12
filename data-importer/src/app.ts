import express, {
    Application
} from 'express';
import 'dotenv/config';

import router from './routes/index';
import connDB from './config/db';

const app:Application = express();
const port = process.env.PORT || 4000;
connDB();

app.use('/', router);

app.listen(port, () => console.log(`server running on ${port}...`))