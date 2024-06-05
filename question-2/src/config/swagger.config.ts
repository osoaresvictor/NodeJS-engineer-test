import { SwaggerOptions } from '@fastify/swagger';
import { FastifySwaggerUiOptions } from '@fastify/swagger-ui';

const swaggerOptions: SwaggerOptions = {
  openapi: {
    info: {
      title: 'Simple Customer Registration API',
      description: 'A simple CRUD API to register customers',
      version: '1.0.0',
      contact: {
        name: 'Victor Soares',
        email: 'victor_soares@live.com',
        url: 'https://www.linkedin.com/in/soares-victor-it/',
      },
    },
  },
};

const swaggerUiOptions: FastifySwaggerUiOptions = {
  routePrefix: '/documentation',
  uiConfig: {
    docExpansion: 'list',
    deepLinking: false,
  },
};

export { swaggerOptions, swaggerUiOptions };
