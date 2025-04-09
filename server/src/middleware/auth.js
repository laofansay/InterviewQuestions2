const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

/**
 * 认证中间件
 * 验证请求中的JWT token并解析用户信息
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - Express next函数
 */
const authenticateUser = async (req, res, next) => {
    // 从请求头中获取token
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: '请先登录' });
    }
    try {
        // 使用Supabase验证token并获取用户信息
        const { data: { user }, error } = await supabase.auth.getUser(token);
        if (error) throw error;
        // 将用户信息添加到请求对象中
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({
            error: '无效的认证令牌'
        });
    }
};

module.exports = authenticateUser;