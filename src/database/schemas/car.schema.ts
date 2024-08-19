import mongoose from "mongoose";

const carSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      auto: true,
    },
    brand: String,
    model: String,
    year: Number,
    color: {
      r: String,
      g: String,
      b: String,
    },
  },
  { timestamps: true },
);

export const carModel = mongoose.model("cars", carSchema);
