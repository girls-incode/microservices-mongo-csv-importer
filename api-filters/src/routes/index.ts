import express from 'express';

import {
    errorHandler,
    getAllCountries,
    getAllEmissions,
    getAllSectors,
    sumYearsEmissionsCountry,
    yearsEmissionsCountrySector,
} from '../controllers/index';

const router = express.Router();

router.get('/', getAllEmissions);

router.get('/sectors', getAllSectors);

router.get('/countries', getAllCountries);

router.get('/countries/:name', sumYearsEmissionsCountry);

router.get('/countries/:country/:sector/:year', yearsEmissionsCountrySector);

router.get('*', errorHandler);

export default router;