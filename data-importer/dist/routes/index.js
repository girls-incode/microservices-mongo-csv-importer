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
const fs_1 = __importDefault(require("fs"));
const multer_1 = __importDefault(require("multer"));
const csv_parser_1 = __importDefault(require("csv-parser"));
const Emissions_1 = __importDefault(require("../models/Emissions"));
const router = express_1.default.Router();
const upload = multer_1.default({ dest: 'tmp/' });
const fieldName = upload.single('emissions');
router.post('/', fieldName, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let i = 1;
    let results = [];
    let file = req.file.path;
    fs_1.default.createReadStream(file)
        .pipe(csv_parser_1.default())
        .on('data', (row) => __awaiter(void 0, void 0, void 0, function* () {
        let item = {
            country: row['Country'],
            sector: row['Sector'],
            parent_sector: row['Parent sector'],
            emissions: []
        };
        delete row['Country'];
        delete row['Sector'];
        delete row['Parent sector'];
        const years = Object.entries(row);
        if (years) {
            for (const [year, val] of years) {
                item.emissions.push({
                    year: parseInt(year),
                    value: parseFloat(val)
                });
            }
        }
        results.push(item);
        i++;
    }))
        .on('end', () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield Emissions_1.default.deleteMany();
            console.log('clean db...');
        }
        catch (error) {
            return res.status(500).send('cannot clean db');
        }
        Emissions_1.default.insertMany(results)
            .then(() => {
            console.log(`saved ${i} rows`);
            return res.status(200).send(`imported ${results.length} data`);
        })
            .catch(error => {
            return res.status(500).send(`import issue: ${error}`);
        });
        fs_1.default.unlinkSync(file);
    }))
        .on('error', (err) => {
        console.log(err.message);
        return res.status(500).send(`error reading file: ${err.message}`);
    });
}));
exports.default = router;
