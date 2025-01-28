const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, "OYE123");
    req.user = decoded;
    next();
  } catch (error) {
    console.log("error: " + error);
    return res.status(403).json({ message: "Invalid token" });
  }
};

const requireAdmin = (req, res, next) => {
  console.log("requireAdmin", req.user);
  if (!req.user || req.user.roles !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

module.exports = { authenticateToken, requireAdmin };
