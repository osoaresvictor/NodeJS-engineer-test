import 'reflect-metadata';
import { fastify } from 'fastify';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import customerRoutes from './routes/customer.routes';
import { swaggerOptions, swaggerUiOptions } from './config/swagger.config';
import { fastifyAwilixPlugin } from '@fastify/awilix';
import iocContainer from './config/ioc-container.config';

const app = fastify({ logger: true });

app.register(fastifyAwilixPlugin, {
  disposeOnClose: true,
  disposeOnResponse: true,
  container: iocContainer,
});

app.register(swagger, swaggerOptions);
app.register(swaggerUi, swaggerUiOptions);

app.register(customerRoutes, { prefix: '/customers' });

export default app;
