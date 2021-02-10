"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Emissions_1 = __importDefault(require("../models/Emissions"));
const router = express_1.default.Router();
/**
 *  @swagger
 *  /api/v1:
 *    get:
 *      description: get all emissions data
 *      responses:
 *          '200':
 *             description: successful get response
 */
router.get('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield Emissions_1.default.find({}).lean();
        if (data)
            res.status(200).json(data);
    }
    catch (error) {
        res.status(400).send(error);
    }
}));
// all sectors sorted asc
router.get('/sectors', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield Emissions_1.default.aggregate([
            { $group: { _id: '$sector' } },
            { $sort: { _id: 1 } },
        ]);
        if (data)
            res.status(200).json(data.map((item) => item._id));
    }
    catch (error) {
        res.status(400).send(error);
    }
}));
// all countries sorted asc
router.get('/countries', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield Emissions_1.default.aggregate([
            { $group: { _id: '$country' } },
            { $sort: { _id: 1 } },
        ]);
        if (data)
            res.status(200).json(data.map((item) => item._id));
    }
    catch (error) {
        res.status(400).send(error);
    }
}));
// sum all years emmissions for a country
router.get('/countries/:name', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.params;
    try {
        const data = yield Emissions_1.default.aggregate([
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
        let found = data.filter((item) => item._id === name.toUpperCase())[0];
        if (data)
            res.status(200).json({ country: found._id, sum: found.sum });
    }
    catch (error) {
        res.status(400).send(error);
    }
}));
// a year emission for a country in a sector
// http://localhost:4000/api/v1/countries/abw/Fuel%20Combustion%20Activities/2000
router.get('/countries/:country/:sector/:year', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { country, sector, year } = req.params;
    console.log(country, sector, year);
    try {
        const data = yield Emissions_1.default.aggregate([
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
        if (data)
            res.status(200).json(data[0]);
    }
    catch (error) {
        res.status(400).send(error);
    }
}));
exports.default = router;
