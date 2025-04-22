const jwt = require("jsonwebtoken");

// Middleware that verifies the user's JWT token and retrieves the user's data

module.exports = (req, res, next) => {
  try {
    // The token is usually in the format "Bearer <token>", so we split it. Extract the token part (after "Bearer")
    const token = req.headers.authorization?.split(" ")[1];
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
    console.log("Middleware authenticate Decoded JWT:", decodedToken);
    const { userId, role, userName } = decodedToken;

    // Attach the decoded payload to the request object for future use
    req.auth = {
      userName: userName,
      userId: userId,
      role: role, // add role to req.auth
    };
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    res.status(401).json({ error });
  }
};
