// middleware/authMiddleware.js

const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  let token = req.header("Authorization");
  token = token.replace("Bearer ", "").trim();
  console.log(token, "being logged from the middleware");

  console.log(process.env.JWT_SECRET, "is the env secret");
  if (!token) return res.status(401).json({ error: "Access denied" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error.message);
    res.status(401).json({ error: "Invalid token" });
  }
}

module.exports = verifyToken;
