const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 50,
        required: true,
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
        required: true,
    },
    status: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Status",
        required: true,
    },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
