const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const db = require('./config/db');
const authRoutes = require('./routes/authRoutes');

// 💡 CORS Middleware 
app.use(cors({
  origin: '*', // allow all origins temporarily
  credentials: true
}));


// Middleware for parsing JSON
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});

