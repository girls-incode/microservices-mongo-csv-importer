import express, {
    Request,
    Response,
    NextFunction
} from 'express';
import Emissions from '../models/Emissions';

/**
 * @swagger
 * /:
 *  get:
 *   tags: ["emissions"]
 *   description: get all emissions
 *   produces:
 *    - application/json
 *   responses:
 *    200:
 *     description: successful response
 */
export const getAllEmissions = async (req: Request, res: Response, next: NextFunction) => {
    const data = await Emissions.find({}).lean().catch((err) => next(err));
    return res.status(200).json(data);
}

/**
 * @swagger
 * /sectors:
 *  get:
 *   tags: ["emissions"]
 *   description: get all sectors sorted asc
 *   produces:
 *    - application/json
 *   responses:
 *    200:
 *     description: successful response
 */
export const getAllSectors = async (req: Request, res: Response, next: NextFunction) => {
    const data: any = await Emissions.aggregate([
        { $group: { _id: '$sector' } },
        { $sort: { _id: 1 } },
    ]).catch((err) => next(err));
    return res.status(200).json(data.map((item: any) => item._id));
}

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
 *     description: successful response
 */
export const getAllCountries = async (req: Request, res: Response, next: NextFunction) => {
    const data: any = await Emissions.aggregate([
        { $group: { _id: '$country' } },
        { $sort: { _id: 1 } },
    ]).catch((err) => next(err));

    return res.status(200).json(data.map((item: any) => item._id));
}

/**
 * @swagger
 * /countries/{name}:
 *  parameters: 
 *   - name: name
 *     in: path
 *     description: country code name (3letters)
 *     schema:
 *      type: string
 *      minimum: 3
 *  get:
 *   tags: ["emissions"]
 *   description: sum all years emmissions for a country
 *   produces:
 *    - application/json
 *   responses:
 *    200:
 *     description: successful response
 */
export const sumYearsEmissionsCountry = async (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.params;

    const data: any = await Emissions.aggregate([
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
    ]).catch((err) => next(err));

    let found = data.filter((item: any) => item._id === name.toUpperCase())[0];

    return res.status(200).json({ country: found._id, sum: found.sum });
}

/**
 * @swagger
 * /countries/{country}/{sector}/{year}:
 *  parameters:
 *   - in: path
 *     name: country
 *     description: country code name (3letters)
 *     schema:
 *      type: string
 *      minimum: 3
 *   - in: path
 *     name: sector
 *     schema:
 *      type: string
 *      minimum: 3
 *   - in: path
 *     name: year
 *     schema:
 *      type: number
 *      minimum: 4
 *  get:
 *   tags: ["emissions"]
 *   description: a year emission for a country in a sector
 *   produces:
 *    - application/json
 *   responses:
 *    200:
 *     description: successful response
 */
export const yearsEmissionsCountrySector = async (req: Request, res: Response, next: NextFunction) => {
    let { country, sector, year } = req.params;

    const data: any = await Emissions.aggregate([
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
    ]).catch((err) => next(err));

    return res.status(200).json(data[0] || 'no value');
}

export const errorHandler = (req: Request, res: Response, next: NextFunction) => {
    const error: any = new Error(`${req.ip} tried to access ${req.originalUrl}`);
    error.statusCode = 301;
    next(error);
}