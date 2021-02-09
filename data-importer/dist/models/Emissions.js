"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const EmissionSchema = new mongoose_1.default.Schema({
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
const EmissionsSchema = new mongoose_1.default.Schema({
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
exports.default = mongoose_1.default.model('Emissions', EmissionsSchema);
