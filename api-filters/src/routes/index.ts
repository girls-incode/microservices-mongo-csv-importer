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

// all data
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await Emissions.find({}).lean();
        // console.log(data);
        if (data) res.status(200).json(data);
    } catch (error) {
        res.status(400).send(error)
    }
})

// all sectors sorted asc
router.get('/sectors', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await Emissions.aggregate([
            { $group: { _id: "$sector" } },
            { $sort: { _id: 1 } },
        ]);

        if (data) res.status(200).json(data.map((item: any) => item._id));
    } catch (error) {
        res.status(400).send(error)
    }
})

// all countries sorted asc
router.get('/countries', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = await Emissions.aggregate([
            { $group: { _id: "$country" } },
            { $sort: { _id: 1 } },
        ]);

        if (data) res.status(200).json(data.map((item: any) => item._id));
    } catch (error) {
        res.status(400).send(error)
    }
});

router.get('/countries/:name', async (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.params;

    try {
        // const data = await Emissions.find({ country: 'AWB' }, (err, country) => {
        //     Emissions.aggregate([
        //         // '{ country: 'AWB'' },
        //         {
        //             $group: {
        //                 _id: "$country",
        //                 'sum': {
        //                     $sum: '$emissions.value'
        //                 }
        //             }
        //         }, {
        //             $project: {
        //                 'sum': '$sum'
        //             }
        //         }
        //     ]);
        // });

        const data = await Emissions.aggregate([
            // { $match: { country:name } },
            {
                $group: {
                    _id: "$country",
                    'sum': {
                        $sum: '$emissions.value'
                    }
                }
            }
        ]);

        console.log(data);

        res.send(name)
        // if (data) res.status(200).json(data.map((item: any) => item._id));
    } catch (error) {
        res.status(400).send(error)
    }
})

export default router;