import express, {
    Application,
    Request,
    Response,
    NextFunction
} from 'express';
import fs from 'fs';
import multer from 'multer';
import csv from 'csv-parser';
import Emissions from '../models/Emissions';

interface Row {
    country: string
}

interface Emission {
    year: number,
    value: number
}

const router = express.Router();
const upload = multer({ dest: 'tmp/' });

router.post('/', upload.single('emissions'),  async (req: Request, res: Response, next: NextFunction) => {
    let i = 1;
    let results: any[] = [];
    let file = req.file.path;
    
    fs.createReadStream(file)
        .pipe(csv())
        .on('data', async (row) => {
            let item = {
                country: row['Country'],
                sector: row['Sector'],
                parent_sector: row['Parent sector'],
                emissions: []
            }
            delete row['Country'];
            delete row['Sector'];
            delete row['Parent sector'];
            const years = Object.entries(row);
            if (item && years) {
                for (const [year, val] of years) {
                    item.emissions.push({
                        //@ts-ignore
                        year: parseInt(year),
                        //@ts-ignore
                        value: parseFloat(val)
                    })
                }
            }

            // if (i % 500 === 0) {
            // console.log('i: ', i);

            // promises.push(await Emissions.insertMany(results));
            // results = [];

            // results[++j] = [];

            //     Emissions.insertMany(results)
            //         .then(() => {
            //             console.log('saved 500 rows')
            //             results = [];
            //         })
            //         .catch(error => {
            //             errors.push(error.message);
            //             console.log(error)
            //         });
            // }
            // results[j].push(item);

            results.push(item);
            i++;
        })
        .on('end', async () => {
            console.log('to be inserted: ' + i + ' rows');
            fs.unlinkSync(file);

            try {
                await Emissions.deleteMany();
                console.log('cleaned db...');
            } catch (error) {
                return res.status(500).send('cannot clean the db')
            }

            // Promise.all(promises)
            //     .then((results) => {
            //         console.log(`saved ${i} rows`);
            //         res.status(200).send(`imported ${results.length} data`)
            //     })
            //     .catch(error => {
            //         res.status(500).send('import issue: ' + errors.join('\n'))
            //         // console.log(errors.join('\n'))
            //     });

            Emissions.insertMany(results)
                .then(() => {
                    console.log(`saved ${i} rows`)
                    return res.status(200).send(`imported ${results.length} data`)
                })
                .catch(error => {
                    return res.status(500).send('import issue: ' + error)
                });

            // results.map(async (data: Array<any>) => {
            //     Emissions.insertMany(data)
            //         .then(() => console.log('saved 500 rows'))
            //         .catch(error => {
            //             errors.push(error.message);
            //             console.log(error)
            //         });
            // });
        })
        .on('error', (err) => {
            console.log(err.message);
            return res.status(500).send('error reading file: ' + err.message)
        });
});

export default router;