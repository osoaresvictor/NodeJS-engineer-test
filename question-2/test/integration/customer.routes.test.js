"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const database_config_1 = __importDefault(require("../../src/config/database.config"));
const globals_1 = require("@jest/globals");
const customer_repository_1 = __importDefault(require("../../src/repositories/customer.repository"));
const awilix_1 = require("@fastify/awilix");
const ioc_container_config_1 = __importDefault(require("../../src/config/ioc-container.config"));
const customer_routes_1 = __importDefault(require("../../src/routes/customer.routes"));
let app;
let customerRepository;
(0, globals_1.beforeAll)(async () => {
    process.env.TEST_DATABASE = ':memory:';
    process.env.SYNCHRONIZE_DB = 'true';
    process.env.URL_ZIPCODE_API = 'https://cep.awesomeapi.com.br/json/';
    await database_config_1.default.connect();
    app = (0, fastify_1.default)();
    app.register(awilix_1.fastifyAwilixPlugin, {
        disposeOnClose: true,
        disposeOnResponse: true,
        container: ioc_container_config_1.default,
    });
    await app.register(customer_routes_1.default, { prefix: '/customers' });
    await app.ready();
    customerRepository = new customer_repository_1.default();
});
(0, globals_1.afterAll)(async () => {
    database_config_1.default.getInstance().dropDatabase();
    await app.close();
});
(0, globals_1.describe)('Customer Routes', () => {
    (0, globals_1.it)('should create a new customer', async () => {
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
        (0, globals_1.expect)(response.statusCode).toBe(201);
        const customer = await customerRepository.findById(1);
        (0, globals_1.expect)(customer).toMatchObject({
            id: 1,
            fullName: 'Victor Test',
            email: 'victor.test@mail.com',
            address: 'Praça da Sé 10, Sé - São Paulo/SP - CEP: 01001000',
        });
    });
    (0, globals_1.it)('should get all customers', async () => {
        // Act
        const response = await app.inject({
            method: 'GET',
            url: '/customers',
        });
        // Assert
        (0, globals_1.expect)(response.statusCode).toBe(200);
        (0, globals_1.expect)(response.json()).toBeInstanceOf(Array);
    });
    (0, globals_1.it)('should get a customer by id', async () => {
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
        (0, globals_1.expect)(response.statusCode).toBe(200);
        (0, globals_1.expect)(response.json()).toMatchObject(customerData);
    });
    (0, globals_1.it)('should update a customer by id', async () => {
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
        (0, globals_1.expect)(response.statusCode).toBe(200);
        const updatedCustomer = await customerRepository.findById(3);
        (0, globals_1.expect)(updatedCustomer).toMatchObject({
            id: 3,
            fullName: 'Carlos do Teste Updated',
            email: 'carlos.tst.updated@testmail.com.br',
            address: 'Avenida Paulista, 1.578',
        });
    });
    (0, globals_1.it)('should delete a customer by id', async () => {
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
        (0, globals_1.expect)(response.statusCode).toBe(200);
        (0, globals_1.expect)(response.json()).toMatchObject({
            message: `Customer '4' deleted successfully`,
        });
        const deletedCustomer = await customerRepository.findById(4);
        (0, globals_1.expect)(deletedCustomer).toBeNull();
    });
});
//# sourceMappingURL=customer.routes.test.js.map
