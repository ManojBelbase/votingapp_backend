import Candidate from "../models/candidate.model.js";
import User from "../models/user.model.js";

const checkAdminRole = async (userId) => {
  try {
    const user = await User.findById(userId);
    return user.role === "admin";
  } catch (error) {
    return false;
  }
};

// create candidate
const createCandidate = async (req, res) => {
  try {
    const isAdmin = await checkAdminRole(req.user.id);
    if (!isAdmin) {
      return res.status(403).json({ message: "User does not have admin role" });
    }

    const data = req.body;
    const existingCandidate = await Candidate.findOne({ party: data.party });
    if (existingCandidate) {
      return res
        .status(400)
        .json({ message: "This Candidate is already registered." });
    }

    const newCandidate = new Candidate(data);
    const response = await newCandidate.save();
    console.log("Candidate Created");
    res.status(200).json({ message: "candidate created", response });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
};

// update candidate
const updateCandidate = async (req, res) => {
  try {
    const isAdmin = await checkAdminRole(req.user.id);
    if (!isAdmin) {
      return res.status(403).json({ message: "User doesnot have admin role" });
    }

    const candidateId = req.params.candidateId;
    const updatedCandidateData = req.body;

    const response = await Candidate.findByIdAndUpdate(
      candidateId,
      updatedCandidateData,
      {
        new: true,
      }
    );

    if (!response) {
      return res.status(404).json({ error: "person not found" });
    }
    console.log("candidate data updated");
    res.status(200).json({ message: "Candidate Date Updated", response });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
};

// Delete candidate
const deleteCandidate = async (req, res) => {
  try {
    const isAdmin = await checkAdminRole(req.user.id);
    if (!isAdmin) {
      return res.status(403).json({ message: "User doesnot have admin role" });
    }

    const candidateId = req.params.candidateId;
    const response = await Candidate.findByIdAndDelete(candidateId);

    if (!response) {
      return res.status(404).json({ message: "Candidate Not found" });
    }

    console.log("candidate Deleted");

    res.status(200).json({ message: "Candidate Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
};

// Voting
const Vote = async (req, res) => {
  try {
    const candidateId = req.params.candidateId;
    const userId = req.user.id;

    // Find candidate and user
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user has already voted
    if (user.isVoted) {
      return res.status(400).json({ message: "You have already voted" });
    }

    // Check if user is an admin
    if (user.role === "admin") {
      return res
        .status(403)
        .json({ message: "Admins are not allowed to vote" });
    }

    // Update candidate document
    candidate.votes.push({ user: userId }); // Assuming votes is an array of user IDs
    candidate.voteCount++;
    await candidate.save();

    // Mark user as having voted
    user.isVoted = true;
    await user.save();

    // Respond with success
    res.status(200).json({ message: "Vote successfully" });
  } catch (error) {
    console.error("Error in vote function:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const voteCount = async (req, res) => {
  try {
    const candidates = await Candidate.find().sort({ voteCount: "desc" });

    // map the candidates to only return their name and vote count
    const voteRecord = candidates.map((data) => {
      return {
        party: data.party,
        count: data.voteCount,
      };
    });

    return res.status(200).json({ voteRecord });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// list of all candidates
const getCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find();
    console.log(candidates);
    res.status(200).json({ candidates });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export {
  createCandidate,
  updateCandidate,
  deleteCandidate,
  Vote,
  voteCount,
  getCandidates,
};
