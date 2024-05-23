const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            lowercase: true,
            minlength: [3, "Name must be at least 3 characters long"],
            maxlength: [50, "Name must be less than 50 characters long"],
            required: [true, "Name is required"],
            validate: {
                validator: function (v) {
                    return validator.isAlpha(v.replace(/\s/g, ""), "en-US", {
                        ignore: " ",
                    });
                },
                message: (props) =>
                    `${props.value} contains invalid characters`,
            },
        },
        phone: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            validate: {
                validator: function (v) {
                    // Array of Arab country locales
                    const arabLocales = [
                        "ar-AE", // United Arab Emirates
                        "ar-BH", // Bahrain
                        "ar-DZ", // Algeria
                        "ar-EG", // Egypt
                        "ar-IQ", // Iraq
                        "ar-JO", // Jordan
                        "ar-KW", // Kuwait
                        "ar-LB", // Lebanon
                        "ar-LY", // Libya
                        "ar-MA", // Morocco
                        "ar-OM", // Oman
                        "ar-PS", // Palestine
                        "ar-QA", // Qatar
                        "ar-SA", // Saudi Arabia
                        "ar-SD", // Sudan
                        "ar-SY", // Syria
                        "ar-TN", // Tunisia
                        "ar-YE", // Yemen
                    ];
                    return validator.isMobilePhone(v, arabLocales);
                },
                message: (props) =>
                    `${props.value} is not a valid phone number in any of the specified Arab countries!`,
            },
        },
        role: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Role",
            required: [true, "Role is required"],
        },
        status: {
            type: String,
            enum: ["ACTIVE", "DELETED"],
            default: "ACTIVE",
        },
    },
    {
        collection: "users",
        timestamps: true,
    }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
