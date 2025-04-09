const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../src/config/swagger');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5174',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    maxAge: 600
}));

app.use(express.json());
app.use((req, res, next) => {
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
});

// Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/', require('../src/routes/base.routes'));  // 添加基础路由
app.use('/api/auth', require('../src/routes/auth.routes'));
app.use('/api/products', require('../src/routes/product.routes'));
app.use('/api/courses', require('../src/routes/course.routes'));
app.use('/api/videos', require('../src/routes/video.routes'));
app.use('/api/watch-history', require('../src/routes/watch-history.routes'));
app.use('/api/course-progress', require('../src/routes/course-progress.routes'));

// Error handler
//app.use(require('../src/middleware/errorHandler'));

// For local development
if (process.env.NODE_ENV !== 'production') {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}

module.exports = app;