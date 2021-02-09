import express, {
    Request,
    Response,
    NextFunction
} from 'express';
import fs from 'fs';
import multer from 'multer';
import csv from 'csv-parser';
import Emissions from '../models/Emissions';

interface Emission {
    year: number,
    value: number
}
interface Row {
    country: string,
    sector: string,
    parent_sector: string,
    emissions: Emission[]
}

const router = express.Router();
const upload = multer({ dest: 'tmp/' });
const fieldName = upload.single('emissions');

router.post('/', fieldName, async (req: Request, res: Response, next: NextFunction) => {
    let i = 1;
    let results: any[] = [];
    let file: string = req.file.path;
    
    fs.createReadStream(file)
        .pipe(csv())
        .on('data', async (row) => {
            let item: Row = {
                country: row['Country'],
                sector: row['Sector'],
                parent_sector: row['Parent sector'],
                emissions: []
            }
            delete row['Country'];
            delete row['Sector'];
            delete row['Parent sector'];

            const years: any = Object.entries(row);
            if (years) {
                for (const [year, val] of years) {
                    item.emissions.push({
                        year: parseInt(year),
                        value: parseFloat(val)
                    } as Emission)
                }
            }
            results.push(item);
            i++;
        })
        .on('end', async () => {
            try {
                await Emissions.deleteMany();
                console.log('clean db...');
            } catch (error) {
                res.status(500).send('cannot clean db')
            }

            Emissions.insertMany(results)
                .then(() => {
                    console.log(`saved ${i} rows`);
                    res.status(200).send(`imported ${results.length} data`)
                })
                .catch(error => {
                    res.status(500).send(`import issue: ${error}`)
                });

            fs.unlinkSync(file);
        })
        .on('error', (err) => {
            console.log(err.message);
            res.status(500).send(`error reading file: ${err.message}`)
        });
});

export default router;