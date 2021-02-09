import express, {
    Application
} from 'express';
import 'dotenv/config';

import router from './routes/index';
import connDB from './db';

const app: Application = express();
const port = process.env.PORT || 3900;
connDB();

app.use('/api/v1', router);

app.listen(port, () => console.log(`server running on ${port}...`))