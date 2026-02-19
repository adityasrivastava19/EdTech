require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRouter = require('./routes/authroute');
const userRouter = require('./routes/userroute');
const instructorRouter = require('./routes/instructorroute');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/instructor', instructorRouter);

// Health check
app.get('/', (req, res) => {
    res.json({ message: 'Course API is running' });
});

// Connect DB and start server
connectDB().then(() => {
    const server = app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
    server.setTimeout(10 * 60 * 1000); // 10 min — allow large video uploads
});
