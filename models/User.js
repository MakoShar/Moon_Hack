const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    enrollmentNumber: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["Manager", "Member"], required: true }, // User role
    credits: { type: Number, default: 0 } // Initial credits set to 0
});

module.exports = mongoose.model("User", userSchema);
