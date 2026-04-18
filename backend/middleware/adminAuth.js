const jwt = require("jsonwebtoken");

const adminAuth = (req, res, next) => {
  try {
    let token = req.header("Authorization");

    if (!token) {
      return res.status(401).json({ message: "No token, access denied" });
    }

    if (token.startsWith("Bearer ")) {
      token = token.slice(7);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    if (req.user.role !== "admin") {
      res.status(403).json({ message: "Forbidden" });
      return;
    }

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = adminAuth;
