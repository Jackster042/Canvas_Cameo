const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || process.env.AUTH_GOOGLE_ID);

async function authMiddleware(req, res, next) {
  // 1. Extract token from multiple sources
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : req.cookies?.token;

  if (!token) {
    console.log('No token provided in request');
    return res.status(401).json({ error: "Authorization token required" });
  }

  try {
    // 2. Verify token with enhanced options
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: [
        process.env.GOOGLE_CLIENT_ID,
      ].filter(Boolean),
      clockTolerance: 30 // 30-second leeway for clock skew
    });

    const payload = ticket.getPayload();

    if (!payload) {
      console.error('Token verification returned empty payload');
      return res.status(401).json({ error: "Invalid token payload" });
    }

    // 3. Enhanced user object
    req.user = {
      userId: payload.sub,
      email: payload.email,
      name: payload.name,
    };

    // 4. Add headers for downstream services
    req.headers['x-user-id'] = payload.sub;
    req.headers['x-user-email'] = payload.email;

    console.log(`Authenticated user: ${payload.email}`);
    next();
  } catch (error) {
    console.error('Token verification failed:', {
      error: error.message,
      token: token.substring(0, 10) + '...', // Log partial token for debugging
      clientId: process.env.GOOGLE_CLIENT_ID
    });

    res.status(401).json({
      error: "Invalid token",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

module.exports = { authMiddleware };