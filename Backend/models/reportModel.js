const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  type: { type: String, required: true }, // "lost" or "found"
  name: { type: String, required: true },
  category: { type: String, required: true },
  description: String,
  date: String,
  location: String,
  fullName: { type: String, required: true },
  mobile: { type: String, required: true },
  classCourse: String, // only for lost items
  photo: String,
  resolvedAt: String, // timestamp when resolved
}, { timestamps: true });

module.exports = mongoose.model("Report", reportSchema);
