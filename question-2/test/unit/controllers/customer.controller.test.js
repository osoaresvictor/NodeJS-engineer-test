"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const customer_service_1 = __importDefault(require("../../src/../../src/services/customer.service"));
const customer_controller_1 = __importDefault(require("../../../src/controllers/customer.controller"));
const helpers_util_1 = require("../../../src/utils/helpers.util");
const http_status_codes_1 = require("http-status-codes");
const exceptions_1 = require("../../../src/exceptions");
const customer_model_1 = __importDefault(require("../../../src/models/customer.model"));
jest.mock('../../../src/services/customer.service');
jest.mock('../../../src/utils/helpers.util');
describe('CustomerController', () => {
    let customerController;
    let customerService;
    let reply;
    beforeEach(() => {
        const customerRepository = {};
        const zipCodeAPIClient = {};
        customerService = new customer_service_1.default(customerRepository, zipCodeAPIClient);
        customerController = new customer_controller_1.default(customerService);
        reply = {
            code: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis(),
        };
    });
    describe('createCustomer', () => {
        it('should create a customer and return 201', async () => {
            // Arrange
            const req = {
                body: { fullName: 'John Doe', email: 'john@example.com', address: '123 Street' },
            };
            const customer = new customer_model_1.default(1, 'John Doe', 'john@example.com', '123 Street');
            customerService.createCustomer.mockResolvedValue(customer);
            // Act
            await customerController.createCustomer(req, reply);
            // Assert
            expect(reply.code).toHaveBeenCalledWith(http_status_codes_1.StatusCodes.CREATED);
            expect(reply.send).toHaveBeenCalledWith(customer);
        });
        it('should handle InvalidZipCodeException', async () => {
            // Arrange
            const req = {
                body: { fullName: 'John Doe', email: 'john@example.com', address: '123 Street' },
            };
            customerService.createCustomer.mockRejectedValue(new exceptions_1.InvalidZipCodeException());
            // Act
            await customerController.createCustomer(req, reply);
            // Assert
            expect(reply.code).toHaveBeenCalledWith(http_status_codes_1.StatusCodes.BAD_REQUEST);
            expect(reply.send).toHaveBeenCalledWith({ message: 'Invalid zip code' });
        });
        it('should handle ZipCodeNotFoundException', async () => {
            // Arrange
            const req = {
                body: { fullName: 'John Doe', email: 'john@example.com', address: '123 Street' },
            };
            customerService.createCustomer.mockRejectedValue(new exceptions_1.ZipCodeNotFoundException('00000000'));
            // Act
            await customerController.createCustomer(req, reply);
            // Assert
            expect(reply.code).toHaveBeenCalledWith(http_status_codes_1.StatusCodes.NOT_FOUND);
        });
        it('should handle generic error', async () => {
            // Arrange
            const req = {
                body: { fullName: 'John Doe', email: 'john@example.com', address: '123 Street' },
            };
            const error = new Error('Generic error');
            customerService.createCustomer.mockRejectedValue(error);
            // Act
            await customerController.createCustomer(req, reply);
            // Assert
            expect(helpers_util_1.handleHttpError).toHaveBeenCalledWith(reply, error);
        });
    });
    describe('getAllCustomers', () => {
        it('should return all customers', async () => {
            // Arrange
            const customers = [new customer_model_1.default(1, 'John Doe', 'john@example.com', '123 Street')];
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
            expect(helpers_util_1.handleHttpError).toHaveBeenCalledWith(reply, error);
        });
    });
    describe('getCustomerById', () => {
        it('should return a customer by id', async () => {
            // Arrange
            const req = {
                params: { id: 1 },
            };
            const customer = new customer_model_1.default(1, 'John Doe', 'john@example.com', '123 Street');
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
            };
            const error = new Error('Generic error');
            customerService.getCustomerById.mockRejectedValue(error);
            // Act
            await customerController.getCustomerById(req, reply);
            // Assert
            expect(helpers_util_1.handleHttpError).toHaveBeenCalledWith(reply, error);
        });
    });
    describe('updateCustomer', () => {
        it('should update a customer', async () => {
            // Arrange
            const req = {
                params: { id: 1 },
                body: { fullName: 'Jane Doe', email: 'jane@example.com', address: '456 Street' },
            };
            const updatedCustomer = new customer_model_1.default(1, 'Jane Doe', 'jane@example.com', '456 Street');
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
            };
            customerService.updateCustomer.mockResolvedValue(null);
            // Act
            await customerController.updateCustomer(req, reply);
            // Assert
            expect(reply.code).toHaveBeenCalledWith(http_status_codes_1.StatusCodes.NOT_FOUND);
            expect(reply.send).toHaveBeenCalledWith({ message: 'Customer not found' });
        });
        it('should handle InvalidZipCodeException when updating', async () => {
            // Arrange
            const req = {
                params: { id: 1 },
                body: { fullName: 'Jane Doe', email: 'jane@example.com', address: 'invalid' },
            };
            customerService.updateCustomer.mockRejectedValue(new exceptions_1.InvalidZipCodeException());
            // Act
            await customerController.updateCustomer(req, reply);
            // Assert
            expect(reply.code).toHaveBeenCalledWith(http_status_codes_1.StatusCodes.BAD_REQUEST);
            expect(reply.send).toHaveBeenCalledWith({ message: 'Invalid zip code' });
        });
        it('should handle ZipCodeNotFoundException when updating', async () => {
            // Arrange
            const req = {
                params: { id: 1 },
                body: { fullName: 'Jane Doe', email: 'jane@example.com', address: '12345' },
            };
            customerService.updateCustomer.mockRejectedValue(new exceptions_1.ZipCodeNotFoundException('00000000'));
            // Act
            await customerController.updateCustomer(req, reply);
            // Assert
            expect(reply.code).toHaveBeenCalledWith(http_status_codes_1.StatusCodes.NOT_FOUND);
            expect(reply.send).toHaveBeenCalledWith({ message: 'Zip code not found' });
        });
        it('should handle generic error when updating', async () => {
            // Arrange
            const req = {
                params: { id: 1 },
                body: { fullName: 'Jane Doe', email: 'jane@example.com', address: '456 Street' },
            };
            const error = new Error('Generic error');
            customerService.updateCustomer.mockRejectedValue(error);
            // Act
            await customerController.updateCustomer(req, reply);
            // Assert
            expect(helpers_util_1.handleHttpError).toHaveBeenCalledWith(reply, error);
        });
    });
    describe('deleteCustomer', () => {
        it('should delete a customer', async () => {
            // Arrange
            const req = {
                params: { id: 1 },
            };
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
            };
            const error = new Error('Generic error');
            customerService.deleteCustomer.mockRejectedValue(error);
            // Act
            await customerController.deleteCustomer(req, reply);
            // Assert
            expect(helpers_util_1.handleHttpError).toHaveBeenCalledWith(reply, error);
        });
    });
});
//# sourceMappingURL=customer.controller.test.js.map
