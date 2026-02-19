const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

exports.isAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided. Please login." });
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // { id, role }
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token." });
    }
};

exports.isInstructor = (req, res, next) => {
    if (req.user.role !== "instructor") {
        return res.status(403).json({ message: "Access denied. Instructors only." });
    }
    next();
};

exports.isAdmin = (req, res, next) => {
    if (req.user.role !== "superadmin") {
        return res.status(403).json({ message: "Access denied. Admins only." });
    }
    next();
};
