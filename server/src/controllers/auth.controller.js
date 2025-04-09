const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

exports.register = async (req, res) => {
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
        res.status(400).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
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
        res.status(400).json({ error: error.message });
    }
};

exports.getUser = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: '未提供认证令牌' });
    }
    try {
        const { data: { user }, error } = await supabase.auth.getUser(token);
        if (error) throw error;
        res.json({ user });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
};