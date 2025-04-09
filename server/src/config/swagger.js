const swaggerJsdoc = require('swagger-jsdoc');

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
                url: process.env.API_URL || 'http://localhost:3000',
                description: 'API Server',
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
    apis: ['./src/routes/*.js'],
};

module.exports = swaggerJsdoc(swaggerOptions);