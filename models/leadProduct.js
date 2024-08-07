const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const leadProductSchema = new Schema({
  lead_id: {
    type: Schema.Types.ObjectId,
    ref: "Lead",
    required: true,
  },
  product_id: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
});

const LeadProduct = mongoose.model("LeadProduct", leadProductSchema);
module.exports = LeadProduct;
