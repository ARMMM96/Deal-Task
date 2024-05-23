const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
    roleTitle: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    },
});

const Role = mongoose.model("Role", roleSchema);

module.exports = Role;
