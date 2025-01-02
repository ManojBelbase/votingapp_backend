import mongoose from "mongoose";
const candidateScheme = new mongoose.Schema({
  name: { type: String, required: true },
  party: { type: String, required: true, unique: true },
  age: { type: Number, required: true },
  votes: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      votedAt: {
        type: Date,
        default: Date.now(),
      },
    },
  ],
  voteCount: { type: Number, default: 0 },
});

const Candidate = mongoose.model("Candidate", candidateScheme);
export default Candidate;
