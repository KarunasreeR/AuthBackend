const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const leadSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email_id: {
    type: String,
    required: true,
    unique: true,
  },
  phone_number: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

// Update the 'updated_at' field before saving
leadSchema.pre("save", function (next) {
  this.updated_at = Date.now();
  next();
});

const Lead = mongoose.model("Lead", leadSchema);
module.exports = Lead;
