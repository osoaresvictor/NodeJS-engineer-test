import { FastifyReply, FastifyRequest } from 'fastify';
import CustomerService from '../services/customer.service';
import { CreateCustomerBodyRequest, UpdateCustomerBodyRequest } from '../schemas/customer.schema';
import { handleHttpError as handleGenericHttpError } from '../utils/helpers.util';
import { StatusCodes } from 'http-status-codes';
import {
  InvalidZipCodeException,
  ZipCodeNotFoundException,
  CustomerNotFoundException,
} from '../exceptions';

class CustomerController {
  constructor(private customerService: CustomerService) {}

  async createCustomer(
    req: FastifyRequest<{ Body: CreateCustomerBodyRequest }>,
    reply: FastifyReply,
  ) {
    try {
      const customer = req.body;
      const result = await this.customerService.createCustomer(customer);
      reply.code(StatusCodes.CREATED).send(result);
    } catch (err: unknown) {
      if (err instanceof InvalidZipCodeException) {
        reply.code(StatusCodes.BAD_REQUEST).send({ message: 'Invalid zip code' });
      } else if (err instanceof ZipCodeNotFoundException) {
        reply
          .code(StatusCodes.NOT_FOUND)
          .send({ message: `Zip code '${req.body.zipcode}' not found` });
      } else {
        handleGenericHttpError(reply, err);
      }
    }
  }

  async getAllCustomers(reply: FastifyReply) {
    try {
      const customers = await this.customerService.getAllCustomers();
      reply.send(customers);
    } catch (err: any) {
      handleGenericHttpError(reply, err);
    }
  }

  async getCustomerById(req: FastifyRequest<{ Params: { id: number } }>, reply: FastifyReply) {
    try {
      const { id } = req.params;

      const customer = await this.customerService.getCustomerById(id);
      reply.send(customer);
    } catch (err: any) {
      if (err instanceof CustomerNotFoundException) {
        reply.code(StatusCodes.NOT_FOUND).send({ message: err.message });
      } else {
        handleGenericHttpError(reply, err);
      }
    }
  }

  async updateCustomer(
    req: FastifyRequest<{ Body: Partial<UpdateCustomerBodyRequest>; Params: { id: number } }>,
    reply: FastifyReply,
  ) {
    try {
      const { id } = req.params;
      const customer = req.body;

      const result = await this.customerService.updateCustomer(id, customer);
      if (!result) {
        reply.code(StatusCodes.NOT_FOUND).send({ message: 'Customer not found' });
        return;
      }

      reply.send(result);
    } catch (err: any) {
      if (err instanceof InvalidZipCodeException) {
        reply.code(StatusCodes.BAD_REQUEST).send({ message: 'Invalid zip code' });
      } else if (err instanceof ZipCodeNotFoundException) {
        reply.code(StatusCodes.NOT_FOUND).send({ message: 'Zip code not found' });
      } else {
        handleGenericHttpError(reply, err);
      }
    }
  }

  async deleteCustomer(req: FastifyRequest<{ Params: { id: number } }>, reply: FastifyReply) {
    try {
      const { id } = req.params;
      await this.customerService.deleteCustomer(id);
      reply.send({ message: `Customer '${id}' deleted successfully` });
    } catch (err: any) {
      if (err instanceof CustomerNotFoundException) {
        reply.code(StatusCodes.NOT_FOUND).send({ message: err.message });
      } else {
        handleGenericHttpError(reply, err);
      }
    }
  }
}

export default CustomerController;
