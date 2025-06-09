const express = require("express");
const router = express.Router();
const {
  redirectToLinkedInAuth,
  handleLinkedInCallback,
  postToLinkedIn
} = require("../controllers/linkedin.controller");

router.get("/auth/linkedin", redirectToLinkedInAuth);
router.get("/auth/linkedin/callback", handleLinkedInCallback);
router.post("/post", postToLinkedIn);

module.exports = router;
