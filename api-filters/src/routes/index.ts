import express, {
    Request,
    Response,
    NextFunction
} from 'express';
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

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await Emissions.find({}).lean();
        if (data) res.status(200).json(data);
    } catch (error) {
        res.status(400).send(error)
    }
})

// all sectors sorted asc
router.get('/sectors', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await Emissions.aggregate([
            { $group: { _id: '$sector' } },
            { $sort: { _id: 1 } },
        ]);

        if (data) res.status(200).json(data.map((item: any) => item._id));
    } catch (error) {
        res.status(400).send(error)
    }
})

/**
 * @swagger
 * /countries:
 *  get:
 *   tags: ["emissions"]
 *   description: get all countries sorted asc
 *   produces:
 *    - application/json
 *   responses:
 *    200:
 *     description: successful get response
 */
router.get('/countries', async (req: Request, res: Response) => {
    try {
        const data = await Emissions.aggregate([
            { $group: { _id: '$country' } },
            { $sort: { _id: 1 } },
        ]);

        if (data) res.status(200).json(data.map((item: any) => item._id));
    } catch (error) {
        res.status(400).send(error)
    }
});

// sum all years emmissions for a country
router.get('/countries/:name', async (req: Request, res: Response) => {
    const { name } = req.params;

    try {
        const data = await Emissions.aggregate([
            {
                $unwind: '$emissions'
            },
            {
                $group: {
                    _id: '$country',
                    'sum': {
                        $sum: '$emissions.value'
                    }
                }
            },
            {
                $project: { 'sum': '$sum' }
            }
        ]);

        let found = data.filter((item: any) => item._id === name.toUpperCase())[0];

        if (data) res.status(200).json({ country: found._id, sum: found.sum });
    } catch (error) {
        res.status(400).send(error)
    }
});

// a year emission for a country in a sector
router.get('/countries/:country/:sector/:year', async (req: Request, res: Response) => {
    let { country, sector, year } = req.params;
    console.log(country, sector, year);

    try {
        const data = await Emissions.aggregate([
            {
                $unwind: '$emissions',
            },
            {
                $match: {
                    'country': new RegExp(country, 'i'),
                    'sector': new RegExp(sector, 'i'),
                    'emissions.year': parseInt(year)
                }
            },
            {
                $project: {
                    'emission': '$emissions.value',
                    '_id': 0
                }
            },
        ]);

        if (data) res.status(200).json(data[0]);
    } catch (error) {
        res.status(400).send(error)
    }
})

export default router;