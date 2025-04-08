const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();


const cors = require('cors')


const app = express();
const port = 3000;

// Swagger configuration
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Trae API Documentation',
            version: '1.0.0',
            description: 'API documentation for Trae project',
        },
        servers: [
            {
                url: `http://localhost:${port}`,
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
    },
    apis: ['./routes/*.js'], // Path to the API routes
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(cors({
    origin: 'http://localhost:5174', // 前端地址
    credentials: true, // 如果你需要携带 cookie，设置为 true
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    maxAge: 600
}))

// 设置 Referrer-Policy
app.use((req, res, next) => {
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
    next()
})

// Supabase client configuration
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

// 中间件
app.use(express.json());

// 引入认证中间件
const authenticateUser = require('./middleware/auth');

// 引入路由
const productRouter = require('./routes/product');
const courseRouter = require('./routes/course');
const videoRouter = require('./routes/video');
const watchHistoryRouter = require('./routes/watch-history');
const courseProgressRouter = require('./routes/course-progress');

// 注册路由
app.use('/api/products', authenticateUser, productRouter);
app.use('/api/courses', authenticateUser, courseRouter);
app.use('/api/videos', authenticateUser, videoRouter);
app.use('/api/watch-history', authenticateUser, watchHistoryRouter);
app.use('/api/course-progress', authenticateUser, courseProgressRouter);

// 根路由
app.get('/', (req, res) => {
    res.send('欢迎来到 Express 学习项目！');
});

// 示例 API 路由 (需要登录)
app.get('/api/hello', authenticateUser, (req, res) => {
    res.json({
        message: 'Hello, Express!',
        user: req.user.email
    });
});

// POST 请求示例
app.post('/api/data', (req, res) => {
    const data = req.body;
    res.json({
        message: '数据接收成功',
        data: data
    });
});

// 用户注册
app.post('/api/auth/register', async (req, res) => {
    const { email, password } = req.body;
    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password
        });

        if (error) throw error;

        res.json({
            message: '注册成功，请查收邮件确认',
            user: data.user
        });
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
});

// 用户登录
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) throw error;

        res.json({
            message: '登录成功',
            session: data.session,
            user: data.user
        });
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
});

// 获取用户信息
app.get('/api/auth/user', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: '未提供认证令牌' });
    }

    try {
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error) throw error;

        res.json({ user });
    } catch (error) {
        res.status(401).json({
            error: error.message
        });
    }
});

// 启动服务器
app.listen(port, () => {
    console.log(`服务器运行在 http://localhost:${port}`);
});