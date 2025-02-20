const express = require("express");
const contest = require("../controllers/contestController.js");
const {
  authenticateToken,
  requireAdmin,
} = require("../middlewares/authMiddleware");
const contestRoutes = express.Router();

contestRoutes.post("/create", authenticateToken, contest.createContest);
contestRoutes.post(
  "/addParticipants",
  authenticateToken,
  contest.addParticipant
);
contestRoutes.post(
  "/declareWinners",
  authenticateToken,
  contest.declareWinners
);
contestRoutes.get("/getAllContests", authenticateToken, contest.getContests);
contestRoutes.get("/getContestById", authenticateToken, contest.getContestById);
contestRoutes.patch("/updateContest", authenticateToken, contest.updateContest);
contestRoutes.delete(
  "/removeContest",
  authenticateToken,
  contest.deleteContest
);

module.exports = contestRoutes;
