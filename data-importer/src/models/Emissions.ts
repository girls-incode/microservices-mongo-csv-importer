import mongoose from 'mongoose';

const EmissionSchema = new mongoose.Schema({
    year: {
        type: Number,
        required: true,
        length: 4
    },
    value: {
        type: Number,
        required: true,
    }
});

const EmissionsSchema = new mongoose.Schema({
    country: {
        type: String,
        required: true,
        trim: true,
        length: 3
    },
    sector: {
        type: String,
        required: true,
        trim: true
    },
    parent_sector: {
        type: String,
        trim: true
    },
    emissions: [EmissionSchema]
});

export default mongoose.model('Emissions', EmissionsSchema);