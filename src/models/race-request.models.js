import mongoose from "mongoose";

const raceRequestSchema = mongoose.Schema({
  race: {
    type: Schema.Types.ObjectId,
    ref: "race",
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  status: {
    type: String,
    enum: ["Approved", "Pending", "Rejected"],
    required: true,
  },
});

const RaceRequest = mongoose.model("race_request", raceRequestSchema);

export { RaceRequest };
