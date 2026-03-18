const mongoose = require('mongoose')

const productTypeSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      unique: true
    },
    order: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model('ProductType', productTypeSchema)