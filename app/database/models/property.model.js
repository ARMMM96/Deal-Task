const mongoose = require("mongoose");
const validator = require("validator");

const baseSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            enum: ["Ad", "PropertyRequest"],
            required: [true, "Type is required"],
            trim: true,
        },
        propertyType: {
            type: String,
            enum: ["VILLA", "HOUSE", "LAND", "APARTMENT"],
            required: [true, "Property type is required"],
            trim: true,
        },
        area: {
            type: String,
            required: [true, "Area is required"],
            trim: true,
            minlength: [1, "Area must be at least 1 character long"],
            maxlength: [50, "Area must be less than 50 characters long"],
        },
        price: {
            type: Number,
            required: [true, "Price is required"],
            min: [0, "Price must be a positive number"],
            validate: {
                validator: Number.isFinite,
                message: "Price must be a valid number",
            },
        },
        city: {
            type: String,
            required: [true, "City is required"],
            trim: true,
            minlength: [2, "City must be at least 2 characters long"],
            maxlength: [100, "City must be less than 100 characters long"],
            validate: {
                validator: (value) =>
                    validator.isAlpha(value.replace(/\s/g, ""), "en-US", {
                        ignore: " ",
                    }),
                message:
                    "City must contain only alphabetic characters and spaces",
            },
        },
        district: {
            type: String,
            required: [true, "District is required"],
            trim: true,
            minlength: [2, "District must be at least 2 characters long"],
            maxlength: [100, "District must be less than 100 characters long"],
            validate: {
                validator: (value) =>
                    validator.isAlpha(value.replace(/\s/g, ""), "en-US", {
                        ignore: " ",
                    }),
                message:
                    "District must contain only alphabetic characters and spaces",
            },
        },
        description: {
            type: String,
            trim: true,
            maxlength: [
                200,
                "Description must be less than 200 characters long",
            ],
        },
        createdAt: {
            type: Date,
            default: Date.now,
            required: true,
        },
        refreshedAt: {
            type: Date,
            default: Date.now,
            required: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "CreatedBy is required"],
        },
    },
    {
        collection: "properties",
        timestamps: true,
    }
);

const Property = mongoose.model("Property", baseSchema);

module.exports = Property;
