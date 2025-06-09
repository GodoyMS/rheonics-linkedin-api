const { getAccessToken, getProfile, createPost } = require("../services/linkedin.service");
const { CLIENT_ID, REDIRECT_URI } = process.env;

exports.redirectToLinkedInAuth = (req, res) => {
  const authURL = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}&scope=openid profile email w_member_social`;

  res.redirect(authURL);
};

exports.handleLinkedInCallback = async (req, res) => {
  const code = req.query.code;

  try {
    const access_token = await getAccessToken(code);
    res.json({
      success: true,
      message: "Access token obtained successfully!",
      access_token,
    });
  } catch (err) {
    console.error("Error getting token:", err);
    res.status(500).json({
      success: false,
      message: "Failed to get access token.",
      error: err.message,
    });
  }
};

exports.postToLinkedIn = async (req, res) => {
  const { text } = req.body;
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Missing or invalid Authorization header" });
  }

  const access_token = authHeader.split(" ")[1];

  if (!text || text.trim() === "") {
    return res.status(400).json({ success: false, message: "Missing 'text' in request body." });
  }

  try {
    const profile = await getProfile(access_token);
    await createPost(access_token, profile.sub, text);

    res.json({ success: true, message: "✅ Successfully posted to LinkedIn!" });
  } catch (err) {
    console.error("LinkedIn Post Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to post to LinkedIn.",
      error: err.message,
    });
  }
};
