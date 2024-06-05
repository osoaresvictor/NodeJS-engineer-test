import Fastify, { FastifyInstance } from 'fastify';
import Database from '../../src/config/database.config';
import { describe, beforeAll, afterAll, it, expect } from '@jest/globals';
import CustomerRepository from '../../src/repositories/customer.repository';
import { fastifyAwilixPlugin } from '@fastify/awilix';
import iocContainer from '../../src/config/ioc-container.config';
import customerRoutes from '../../src/routes/customer.routes';

let app: FastifyInstance;
let customerRepository: CustomerRepository;

beforeAll(async () => {
  process.env.TEST_DATABASE = ':memory:';
  process.env.SYNCHRONIZE_DB = 'true';
  process.env.URL_ZIPCODE_API = 'https://cep.awesomeapi.com.br/json/';

  await Database.connect();

  app = Fastify();
  app.register(fastifyAwilixPlugin, {
    disposeOnClose: true,
    disposeOnResponse: true,
    container: iocContainer,
  });
  await app.register(customerRoutes, { prefix: '/customers' });
  await app.ready();

  customerRepository = new CustomerRepository();
});

afterAll(async () => {
  Database.getInstance().dropDatabase();
  await app.close();
});

describe('Customer Routes', () => {
  it('should create a new customer', async () => {
    // Arrange
    const payload = {
      id: 1,
      full_name: 'Victor Test',
      email: 'victor.test@mail.com',
      zipcode: '01001000',
      address_number: '10',
    };

    // Act
    const response = await app.inject({
      method: 'POST',
      url: '/customers',
      payload,
    });

    // Assert
    expect(response.statusCode).toBe(201);
    const customer = await customerRepository.findById(1);
    expect(customer).toMatchObject({
      id: 1,
      fullName: 'Victor Test',
      email: 'victor.test@mail.com',
      address: 'Praça da Sé 10, Sé - São Paulo/SP - CEP: 01001000',
    });
  });

  it('should get all customers', async () => {
    // Act
    const response = await app.inject({
      method: 'GET',
      url: '/customers',
    });

    // Assert
    expect(response.statusCode).toBe(200);
    expect(response.json()).toBeInstanceOf(Array);
  });

  it('should get a customer by id', async () => {
    // Arrange
    const customerData = {
      id: 2,
      fullName: 'João Teste',
      email: 'joao.teste@testmail.com.br',
      address: '54321, 20',
    };
    await customerRepository.create(customerData);

    // Act
    const response = await app.inject({
      method: 'GET',
      url: `/customers/2`,
    });

    // Assert
    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject(customerData);
  });

  it('should update a customer by id', async () => {
    // Arrange
    const originalCustomer = {
      id: 3,
      fullName: 'Carlos do Teste',
      email: 'carlos.tst@testmail.com.br',
      address: 'Avenida Paulista, 1.578',
    };
    const updatePayload = {
      full_name: 'Carlos do Teste Updated',
      email: 'carlos.tst.updated@testmail.com.br',
    };
    await customerRepository.create(originalCustomer);

    // Act
    const response = await app.inject({
      method: 'PUT',
      url: `/customers/3`,
      payload: updatePayload,
    });

    // Assert
    expect(response.statusCode).toBe(200);
    const updatedCustomer = await customerRepository.findById(3);
    expect(updatedCustomer).toMatchObject({
      id: 3,
      fullName: 'Carlos do Teste Updated',
      email: 'carlos.tst.updated@testmail.com.br',
      address: 'Avenida Paulista, 1.578',
    });
  });

  it('should delete a customer by id', async () => {
    // Arrange
    const customerData = {
      id: 4,
      fullName: 'Jane Test',
      email: 'jane@testmail.com.br',
      address: 'Test Street, 587',
    };
    await customerRepository.create(customerData);

    // Act
    const response = await app.inject({
      method: 'DELETE',
      url: `/customers/4`,
    });

    // Assert
    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({
      message: `Customer '4' deleted successfully`,
    });
    const deletedCustomer = await customerRepository.findById(4);
    expect(deletedCustomer).toBeNull();
  });
});
