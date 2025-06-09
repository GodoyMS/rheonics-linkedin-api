const axios = require("axios");
const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } = process.env;

exports.getAccessToken = async (code) => {
  const response = await axios.post(
    "https://www.linkedin.com/oauth/v2/accessToken",
    null,
    {
      params: {
        grant_type: "authorization_code",
        code,
        redirect_uri: REDIRECT_URI,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return response.data.access_token;
};

exports.getProfile = async (access_token) => {
  const response = await axios.get("https://api.linkedin.com/v2/userinfo", {
    headers: { Authorization: `Bearer ${access_token}` },
  });

  return response.data; // includes "sub" which is the user ID
};

exports.createPost = async (access_token, linkedInId, text) => {
  const postData = {
    author: `urn:li:person:${linkedInId}`,
    lifecycleState: "PUBLISHED",
    specificContent: {
      "com.linkedin.ugc.ShareContent": {
        shareCommentary: { text },
        shareMediaCategory: "ARTICLE",
        media: [
          {
            status: "READY",
            description: {
              text: "Check out Rheonics solutions.",
            },
            originalUrl: "https://rheonics.com",
            title: {
              text: "Rheonics Official Website",
            },
          },
        ],
      },
    },
    visibility: {
      "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
    },
  };

  await axios.post("https://api.linkedin.com/v2/ugcPosts", postData, {
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json",
      "X-Restli-Protocol-Version": "2.0.0",
    },
  });
};
