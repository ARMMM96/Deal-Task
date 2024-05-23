const mongoose = require("mongoose");
const validator = require("validator");

const adSchema = new mongoose.Schema(
    {
        property: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Property",
            required: [true, "Property reference is required"],
        },
        createdAt: {
            type: Date,
            default: Date.now,
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
            required: true,
        },
        publishedUntil: {
            type: Date,
            required: [true, "PublishedUntil date is required"],
            validate: {
                validator: (value) =>
                    validator.isAfter(value.toString(), new Date().toString()),
                message: "PublishedUntil date must be in the future",
            },
        },
        isReviewed: {
            type: Boolean,
            default: false,
            required: true,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "CreatedBy is required"],
        },
    },
    {
        collection: "ads",
    }
);

const Ad = mongoose.model("Ad", adSchema);

module.exports = Ad;
