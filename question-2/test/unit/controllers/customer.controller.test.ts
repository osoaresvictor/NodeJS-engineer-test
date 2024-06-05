import { FastifyReply, FastifyRequest } from 'fastify';
import CustomerService from '../../src/../../src/services/customer.service';
import CustomerController from '../../../src/controllers/customer.controller';
import {
  CreateCustomerBodyRequest,
  UpdateCustomerBodyRequest,
} from '../../../src/schemas/customer.schema';
import { handleHttpError as handleGenericHttpError } from '../../../src/utils/helpers.util';
import { StatusCodes } from 'http-status-codes';
import { InvalidZipCodeException, ZipCodeNotFoundException } from '../../../src/exceptions';
import Customer from '../../../src/models/customer.model';
import CustomerRepository from '../../../src/repositories/customer.repository';
import ZipCodeAPIClient from '../../../src/api-clients/zip-code.api-client';

jest.mock('../../../src/services/customer.service');
jest.mock('../../../src/utils/helpers.util');

describe('CustomerController', () => {
  let customerController: CustomerController;
  let customerService: jest.Mocked<CustomerService>;
  let reply: jest.Mocked<FastifyReply>;

  beforeEach(() => {
    const customerRepository = {} as jest.Mocked<CustomerRepository>;
    const zipCodeAPIClient = {} as jest.Mocked<ZipCodeAPIClient>;

    customerService = new CustomerService(
      customerRepository,
      zipCodeAPIClient,
    ) as jest.Mocked<CustomerService>;
    customerController = new CustomerController(customerService);
    reply = {
      code: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    } as unknown as jest.Mocked<FastifyReply>;
  });

  describe('createCustomer', () => {
    it('should create a customer and return 201', async () => {
      // Arrange
      const req = {
        body: { fullName: 'John Doe', email: 'john@example.com', address: '123 Street' },
      } as unknown as FastifyRequest<{ Body: CreateCustomerBodyRequest }>;
      const customer = new Customer(1, 'John Doe', 'john@example.com', '123 Street');
      customerService.createCustomer.mockResolvedValue(customer);

      // Act
      await customerController.createCustomer(req, reply);

      // Assert
      expect(reply.code).toHaveBeenCalledWith(StatusCodes.CREATED);
      expect(reply.send).toHaveBeenCalledWith(customer);
    });

    it('should handle InvalidZipCodeException', async () => {
      // Arrange
      const req = {
        body: { fullName: 'John Doe', email: 'john@example.com', address: '123 Street' },
      } as unknown as FastifyRequest<{ Body: CreateCustomerBodyRequest }>;
      customerService.createCustomer.mockRejectedValue(new InvalidZipCodeException());

      // Act
      await customerController.createCustomer(req, reply);

      // Assert
      expect(reply.code).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
      expect(reply.send).toHaveBeenCalledWith({ message: 'Invalid zip code' });
    });

    it('should handle ZipCodeNotFoundException', async () => {
      // Arrange
      const req = {
        body: { fullName: 'John Doe', email: 'john@example.com', address: '123 Street' },
      } as unknown as FastifyRequest<{ Body: CreateCustomerBodyRequest }>;
      customerService.createCustomer.mockRejectedValue(new ZipCodeNotFoundException('00000000'));

      // Act
      await customerController.createCustomer(req, reply);

      // Assert
      expect(reply.code).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    });

    it('should handle generic error', async () => {
      // Arrange
      const req = {
        body: { fullName: 'John Doe', email: 'john@example.com', address: '123 Street' },
      } as unknown as FastifyRequest<{ Body: CreateCustomerBodyRequest }>;
      const error = new Error('Generic error');
      customerService.createCustomer.mockRejectedValue(error);

      // Act
      await customerController.createCustomer(req, reply);

      // Assert
      expect(handleGenericHttpError).toHaveBeenCalledWith(reply, error);
    });
  });

  describe('getAllCustomers', () => {
    it('should return all customers', async () => {
      // Arrange
      const customers = [new Customer(1, 'John Doe', 'john@example.com', '123 Street')];
      customerService.getAllCustomers.mockResolvedValue(customers);

      // Act
      await customerController.getAllCustomers(reply);

      // Assert
      expect(reply.send).toHaveBeenCalledWith(customers);
    });

    it('should handle generic error', async () => {
      // Arrange
      const error = new Error('Generic error');
      customerService.getAllCustomers.mockRejectedValue(error);

      // Act
      await customerController.getAllCustomers(reply);

      // Assert
      expect(handleGenericHttpError).toHaveBeenCalledWith(reply, error);
    });
  });

  describe('getCustomerById', () => {
    it('should return a customer by id', async () => {
      // Arrange
      const req = {
        params: { id: 1 },
      } as FastifyRequest<{ Params: { id: number } }>;
      const customer = new Customer(1, 'John Doe', 'john@example.com', '123 Street');
      customerService.getCustomerById.mockResolvedValue(customer);

      // Act
      await customerController.getCustomerById(req, reply);

      // Assert
      expect(reply.send).toHaveBeenCalledWith(customer);
    });

    it('should handle generic error', async () => {
      // Arrange
      const req = {
        params: { id: 1 },
      } as FastifyRequest<{ Params: { id: number } }>;
      const error = new Error('Generic error');
      customerService.getCustomerById.mockRejectedValue(error);

      // Act
      await customerController.getCustomerById(req, reply);

      // Assert
      expect(handleGenericHttpError).toHaveBeenCalledWith(reply, error);
    });
  });

  describe('updateCustomer', () => {
    it('should update a customer', async () => {
      // Arrange
      const req = {
        params: { id: 1 },
        body: { fullName: 'Jane Doe', email: 'jane@example.com', address: '456 Street' },
      } as unknown as FastifyRequest<{
        Body: Partial<UpdateCustomerBodyRequest>;
        Params: { id: number };
      }>;
      const updatedCustomer = new Customer(1, 'Jane Doe', 'jane@example.com', '456 Street');
      customerService.updateCustomer.mockResolvedValue(updatedCustomer);

      // Act
      await customerController.updateCustomer(req, reply);

      // Assert
      expect(reply.send).toHaveBeenCalledWith(updatedCustomer);
    });

    it('should handle CustomerNotFoundException when updating', async () => {
      // Arrange
      const req = {
        params: { id: 1 },
        body: { fullName: 'Jane Doe', email: 'jane@example.com', address: '456 Street' },
      } as unknown as FastifyRequest<{
        Body: Partial<UpdateCustomerBodyRequest>;
        Params: { id: number };
      }>;
      customerService.updateCustomer.mockResolvedValue(null);

      // Act
      await customerController.updateCustomer(req, reply);

      // Assert
      expect(reply.code).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
      expect(reply.send).toHaveBeenCalledWith({ message: 'Customer not found' });
    });

    it('should handle InvalidZipCodeException when updating', async () => {
      // Arrange
      const req = {
        params: { id: 1 },
        body: { fullName: 'Jane Doe', email: 'jane@example.com', address: 'invalid' },
      } as unknown as FastifyRequest<{
        Body: Partial<UpdateCustomerBodyRequest>;
        Params: { id: number };
      }>;
      customerService.updateCustomer.mockRejectedValue(new InvalidZipCodeException());

      // Act
      await customerController.updateCustomer(req, reply);

      // Assert
      expect(reply.code).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
      expect(reply.send).toHaveBeenCalledWith({ message: 'Invalid zip code' });
    });

    it('should handle ZipCodeNotFoundException when updating', async () => {
      // Arrange
      const req = {
        params: { id: 1 },
        body: { fullName: 'Jane Doe', email: 'jane@example.com', address: '12345' },
      } as unknown as FastifyRequest<{
        Body: Partial<UpdateCustomerBodyRequest>;
        Params: { id: number };
      }>;
      customerService.updateCustomer.mockRejectedValue(new ZipCodeNotFoundException('00000000'));

      // Act
      await customerController.updateCustomer(req, reply);

      // Assert
      expect(reply.code).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
      expect(reply.send).toHaveBeenCalledWith({ message: 'Zip code not found' });
    });

    it('should handle generic error when updating', async () => {
      // Arrange
      const req = {
        params: { id: 1 },
        body: { fullName: 'Jane Doe', email: 'jane@example.com', address: '456 Street' },
      } as unknown as FastifyRequest<{
        Body: Partial<UpdateCustomerBodyRequest>;
        Params: { id: number };
      }>;
      const error = new Error('Generic error');
      customerService.updateCustomer.mockRejectedValue(error);

      // Act
      await customerController.updateCustomer(req, reply);

      // Assert
      expect(handleGenericHttpError).toHaveBeenCalledWith(reply, error);
    });
  });

  describe('deleteCustomer', () => {
    it('should delete a customer', async () => {
      // Arrange
      const req = {
        params: { id: 1 },
      } as FastifyRequest<{ Params: { id: number } }>;

      // Act
      await customerController.deleteCustomer(req, reply);

      // Assert
      expect(reply.send).toHaveBeenCalledWith({
        message: `Customer '${req.params.id}' deleted successfully`,
      });
    });

    it('should handle generic error when deleting', async () => {
      // Arrange
      const req = {
        params: { id: 1 },
      } as FastifyRequest<{ Params: { id: number } }>;
      const error = new Error('Generic error');
      customerService.deleteCustomer.mockRejectedValue(error);

      // Act
      await customerController.deleteCustomer(req, reply);

      // Assert
      expect(handleGenericHttpError).toHaveBeenCalledWith(reply, error);
    });
  });
});
