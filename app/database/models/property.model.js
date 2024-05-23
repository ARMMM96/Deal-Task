const mongoose = require("mongoose");

const baseSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
            minlength: [3, "Title must be at least 3 characters long"],
        },
        description: {
            type: String,
            required: [true, "Description is required"],
            trim: true,
            minlength: [10, "Description must be at least 10 characters long"],
        },
        price: {
            type: Number,
            required: [true, "Price is required"],
            min: [0, "Price cannot be negative"],
        },
        location: {
            type: String,
            required: [true, "Location is required"],
            trim: true,
            minlength: [3, "Location must be at least 3 characters long"],
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "CreatedBy is required"],
        },
    },
    {
        collection: "properties",
    }
);

const Property = mongoose.model("Property", baseSchema);

module.exports = Property;
