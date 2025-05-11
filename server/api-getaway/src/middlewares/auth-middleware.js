const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1];
  // console.log(token, "Token from authMiddleware");
  if (!token) {
    return res.status(401).json({
      error: "Access denied! No Token provided",
    });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    req.user = {
      userId: payload["sub"],
      email: payload["email"],
      name: payload["name"],
    };

    // ADD USER ID TO HEADERS DOWNSTREAM
    req.headers["x-user-id"] = payload["sub"];

    // OPTIONAL HEADERS
    req.headers["x-user-email"] = payload["email"];
    req.headers["x-user-name"] = payload["name"];

    next();
  } catch (error) {
    console.error(error, "Token verification failed!");
    res.status(401).json({
      error: "Invalid token!",
    });
  }
}

module.exports = { authMiddleware };
