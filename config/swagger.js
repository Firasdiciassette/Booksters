const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Booksters API',
      version: '1.0.0',
      description: 'API documentation for Booksters platform',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
    tags: [
      {
        name: 'Books',
        description: 'Book-related operations',
      },
      {
        name: 'Auth',
        description: 'Authentication-related operations',
      },
      
    ],
  },
  apis: ['./routes/**/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);
module.exports = swaggerSpec;
