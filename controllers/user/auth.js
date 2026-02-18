const user = require("../../database/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Please enter all the fields" });
        }
        const exist = await user.findOne({ email });
        if (exist) {
            return res.status(400).json({ message: "User already exist" });
        }
        const hash = await bcrypt.hash(password, 10);
        const newUser = await user.create({
            name: name,
            email: email,
            password: hash,
            role: "student"
        });
        if (!newUser) {
            return res.status(500).json({ message: "DataBase error" });
        }
        return res.status(201).json({ message: "User created successfully" });
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Enter all the fields" });
        }
        const exist = await user.findOne({ email });
        if (!exist) {
            return res.status(400).json({ message: "User is not found" });
        }
        const ismatch = await bcrypt.compare(password, exist.password); // fixed: added await
        if (!ismatch) {
            return res.status(400).json({ message: "Invalid password" });
        }
        const token = jwt.sign({ id: exist._id, role: exist.role }, JWT_SECRET, { expiresIn: "7d" });
        res.json({ message: "Logged in", token, role: exist.role });
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

exports.requestInstructor = async (req, res) => {
    try {
        await user.findByIdAndUpdate(req.user.id, { instructor: "pending" }); // fixed: user (lowercase), correct field name
        res.json({ message: "Instructor request sent" });
    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
};