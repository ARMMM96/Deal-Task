const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");

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
        phoneNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            validate: {
                validator: function (v) {
                    return validator.isMobilePhone(v); // General phone number validation
                },
                message: (props) =>
                    `${props.value} is not a valid phone number!`,
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
        role: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Roles",
        },
        password: {
            type: String,
            trim: true,
            minLength: 5,
            required: true,
            validate(value) {
                const isValidpassword = validator.isStrongPassword(value, {
                    minLength: 8,
                    minLowercase: 1,
                    minUppercase: 1,
                    minNumbers: 1,
                    minSymbols: 1,
                    returnScore: false,
                });
                if (!isValidpassword) {
                    throw new Error("invalid password format");
                }
            },
        },
        tokens: [
            {
                token: { type: String, required: true },
            },
        ],
    },
    {
        collection: "users",
        timestamps: true,
    }
);

userSchema.pre("save", async function () {
    if (this.isModified("password")) {
        this.password = await bcryptjs.hash(this.password, 8);
    }
});

// Hide user credentials data
userSchema.methods.toJSON = function () {
    const user = this.toObject();
    deletedElements = ["__v", "password", "tokens"];
    deletedElements.forEach((element) => {
        delete user[element];
    });
    return user;
};

// Static method to find user by credentials (email or phone number)
userSchema.statics.findByCredentials = async (identifier, password) => {
    let user;

    if (identifier.includes("@")) {
        // Assume identifier is an email
        user = await User.findOne({ email: identifier });
    } else {
        // Assume identifier is a phone number
        user = await User.findOne({ phoneNumber: identifier });
    }

    if (!user) {
        throw new Error("Invalid email or phone number");
    }

    const isPasswordMatch = await bcryptjs.compare(password, user.password);

    if (!isPasswordMatch) {
        throw new Error("Invalid password");
    }

    return user;
};

// Instance method to generate authentication token
userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign(
        {
            _id: user._id.toString(),
            role: user.role,
        },
        process.env.tokenPassword,
        { expiresIn: "1h" } // Set an appropriate expiry time
    );
    user.tokens = user.tokens.concat({ token });
    await user.save();

    return token;
};
const User = mongoose.model("User", userSchema);

module.exports = User;
