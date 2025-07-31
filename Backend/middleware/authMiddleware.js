const jwt = require("jsonwebtoken");

// ✅ Helper: Token extract and verify
const verifyToken = (req) => {
  const authHeader = req.headers.authorization || req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Token missing or malformed");
  }

  const token = authHeader.split(" ")[1];
  return jwt.verify(token, process.env.JWT_SECRET || 'test_secret_key_for_development');
};

// ✅ 1. Normal user middleware
const authMiddleware = (req, res, next) => {
  try {
    const decoded = verifyToken(req); // { id, role }
    req.user = decoded;
    next();
  } catch (error) {
    console.log('❌ Auth Middleware Error:', error.message);
    return res.status(401).json({ message: "❌ Unauthorized! Invalid Token" });
  }
};

// ✅ 2. Admin + Subadmin access middleware
const adminAuth = (req, res, next) => {
  try {
    const decoded = verifyToken(req);
    if (decoded.role !== "admin" && decoded.role !== "subadmin") {
      return res.status(403).json({ message: "❌ Access Denied! Admin/Subadmin only" });
    }
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "❌ Unauthorized! Invalid Token" });
  }
};



const adminOnly = (req, res, next) => {
  try {
    const decoded = verifyToken(req);
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "❌ Access Denied! Admin only" });
    }
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "❌ Unauthorized! Invalid Token" });
  }
};


const permitRoles = (...roles) => (req, res, next) => {
  try {
    const decoded = verifyToken(req);
    if (!roles.includes(decoded.role)) {
      return res.status(403).json({ message: "❌ Access Denied! Insufficient permissions" });
    }
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "❌ Unauthorized! Invalid Token" });
  }
};


module.exports = { authMiddleware, adminAuth, adminOnly, permitRoles,verifyToken };
