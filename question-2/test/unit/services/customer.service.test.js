"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const exceptions_1 = require("../../../src/exceptions");
const zip_code_api_client_1 = __importDefault(require("../../../src/api-clients/zip-code.api-client"));
const api_client_1 = __importDefault(require("../../../src/api-clients/api-client"));
jest.mock('../../../src/api-clients/api-client');
const mockGet = jest.fn();
api_client_1.default.prototype.get = mockGet;
describe('ZipCodeAPIClient', () => {
    let client;
    beforeEach(() => {
        process.env.URL_ZIPCODE_API = 'https://mock-api.com';
        client = new zip_code_api_client_1.default();
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should throw error if URL_ZIPCODE_API is not set', () => {
        // Arrange
        delete process.env.URL_ZIPCODE_API;
        // Act & Assert
        expect(() => new zip_code_api_client_1.default()).toThrow('URL_ZIPCODE_API environment variable is required');
    });
    it('should throw InvalidZipCodeException for invalid zip codes', async () => {
        // Arrange
        const invalidZipCodes = ['', '123', '1234567'];
        // Act & Assert
        for (const zipCode of invalidZipCodes) {
            await expect(client.getAddress(zipCode)).rejects.toThrow(exceptions_1.InvalidZipCodeException);
        }
    });
    it('should return address for valid zip code', async () => {
        // Arrange
        const mockResponse = {
            cep: '12345678',
            address_type: 'Residential',
            address_name: 'Main St',
            address: '123 Main St',
            state: 'CA',
            district: 'Downtown',
            lat: '34.0522',
            lng: '-118.2437',
            city: 'Los Angeles',
            city_ibge: '1234567',
            ddd: '213',
        };
        const zipCode = '12345678';
        mockGet.mockResolvedValue(mockResponse);
        // Act
        const response = await client.getAddress(zipCode);
        // Assert
        expect(response).toEqual(mockResponse);
        expect(mockGet).toHaveBeenCalledWith(zipCode);
    });
    it('should throw ZipCodeNotFoundException for non-existent zip code', async () => {
        // Arrange
        const zipCode = '00000000';
        const error = new Error('404 Not Found');
        mockGet.mockRejectedValue(error);
        // Act & Assert
        await expect(client.getAddress(zipCode)).rejects.toThrow(new exceptions_1.ZipCodeNotFoundException(zipCode));
        expect(mockGet).toHaveBeenCalledWith(zipCode);
    });
    it('should throw original error for other errors', async () => {
        // Arrange
        const zipCode = '12345678';
        const error = new Error('500 Internal Server Error');
        mockGet.mockRejectedValue(error);
        // Act & Assert
        await expect(client.getAddress(zipCode)).rejects.toThrow(error);
        expect(mockGet).toHaveBeenCalledWith(zipCode);
    });
});
//# sourceMappingURL=customer.service.test.js.map
