exports.welcome = (req, res) => {
    res.send('欢迎来到 laofansay Express 学习项目！');
};

exports.hello = (req, res) => {
    res.json({
        message: 'Hello, Express!',
        user: req.user.email
    });
};

exports.handleData = (req, res) => {
    const data = req.body;
    res.json({
        message: '数据接收成功',
        data: data
    });
};