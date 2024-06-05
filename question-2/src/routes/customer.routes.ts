import { FastifyInstance, FastifyRequest } from 'fastify';
import CustomerController from '../controllers/customer.controller';
import {
  CreateCustomerBodyRequest,
  UpdateCustomerBodyRequest,
  createCustomerSchema,
  getCustomersSchema,
  getCustomerByIdSchema,
  updateCustomerByIdSchema,
  deleteCustomerByIdSchema,
} from '../schemas/customer.schema';
import { AwilixContainer } from 'awilix';

const customerRoutes = async (server: FastifyInstance) => {
  const container: AwilixContainer = server.diContainer;
  const customerController: CustomerController = container.resolve('customerController');

  server.post(
    '',
    { schema: createCustomerSchema },
    (req: FastifyRequest<{ Body: CreateCustomerBodyRequest }>, reply) =>
      customerController.createCustomer(req, reply),
  );

  server.get('', { schema: getCustomersSchema }, (_, reply) =>
    customerController.getAllCustomers(reply),
  );

  server.get(
    '/:id',
    { schema: getCustomerByIdSchema },
    (req: FastifyRequest<{ Params: { id: number } }>, reply) =>
      customerController.getCustomerById(req, reply),
  );

  server.put(
    '/:id',
    { schema: updateCustomerByIdSchema },
    (
      req: FastifyRequest<{ Body: Partial<UpdateCustomerBodyRequest>; Params: { id: number } }>,
      reply,
    ) => customerController.updateCustomer(req, reply),
  );

  server.delete(
    '/:id',
    { schema: deleteCustomerByIdSchema },
    (req: FastifyRequest<{ Params: { id: number } }>, reply) =>
      customerController.deleteCustomer(req, reply),
  );
};

export default customerRoutes;
