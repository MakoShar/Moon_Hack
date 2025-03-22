require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/auth');

const app = express();

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));
app.use(express.json());

// Serve static files
app.use(express.static(__dirname));

// Serve HTML files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'register.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'Login.html'));
});

app.get('/member-dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'member-dashboard.html'));
});

// New routes for navigation
app.get('/new', (req, res) => {
    res.sendFile(path.join(__dirname, 'new.html'));
});

app.get('/events', (req, res) => {
    res.sendFile(path.join(__dirname, 'events.html'));
});

app.get('/chat', (req, res) => {
    res.sendFile(path.join(__dirname, 'chat.html'));
});

// Connect to MongoDB
const connectDB = async () => {
    try {
        console.log('📡 Attempting to connect to Local MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Successfully connected to MongoDB');
    } catch (err) {
        console.error('❌ MongoDB connection error:', err.message);
        console.log('⚠️ Please make sure MongoDB is running on your system');
        console.log('🔄 Retrying connection in 5 seconds...');
        setTimeout(connectDB, 5000);
    }
};

// Handle MongoDB connection events
mongoose.connection.on('connected', () => {
    console.log('🟢 MongoDB Connection: Active');
    console.log('💾 Database:', mongoose.connection.name);
});

mongoose.connection.on('error', (err) => {
    console.error('🔴 MongoDB Error:', err.message);
});

mongoose.connection.on('disconnected', () => {
    console.log('🟡 MongoDB Connection: Disconnected');
});

// Initial connection attempt
connectDB();

// Basic route for testing
app.get('/api/health', (req, res) => {
    const dbState = mongoose.connection.readyState;
    const dbStates = {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting'
    };
    
    res.json({ 
        status: 'ok',
        server: 'running',
        mongodb: {
            status: dbStates[dbState],
            database: mongoose.connection.name
        }
    });
});

// Routes
app.use('/api/auth', authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('🔴 Error:', err.message);
    
    // Specific error handling
    if (err.name === 'ValidationError') {
        return res.status(400).json({ 
            message: 'Validation Error', 
            errors: Object.values(err.errors).map(e => e.message)
        });
    }
    
    if (err.code === 11000) {
        return res.status(400).json({ 
            message: 'Duplicate key error',
            field: Object.keys(err.keyPattern)[0]
        });
    }

    res.status(500).json({ 
        message: err.message || 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`
🚀 Server Status
---------------
✨ Server: Running on port ${PORT}
📊 API Endpoints:
   POST /api/auth/member/register  : Register new member
   POST /api/auth/member/login     : Member login
   POST /api/auth/manager/login    : Manager login
   GET  /api/auth/member/profile   : Get member profile
   GET  /api/auth/member/credits   : Get member credits
   PUT  /api/auth/member/:id/credits : Update member credits
   GET  /api/health               : Server health check

💡 Environment Info:
   - Database URL: ${process.env.MONGODB_URI}
   - Environment: ${process.env.NODE_ENV || 'development'}
   
⚡ Quick Test:
   - Open http://localhost:${PORT}/api/health in your browser
   - Or run: curl http://localhost:${PORT}/api/health
    `);
});

// Handle server shutdown
process.on('SIGTERM', () => {
    console.log('🛑 Shutting down server...');
    server.close(() => {
        console.log('💤 Server closed');
        mongoose.connection.close(false, () => {
            console.log('📴 MongoDB connection closed');
            process.exit(0);
        });
    });
});
