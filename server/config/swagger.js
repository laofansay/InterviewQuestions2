const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Trae API 文档',
            version: '1.0.0',
            description: 'Trae 项目的 API 文档',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: '开发服务器',
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
    apis: ['./routes/*.js'], // API 文件的路径
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;