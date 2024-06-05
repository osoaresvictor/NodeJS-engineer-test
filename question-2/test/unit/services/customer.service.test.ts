import { InvalidZipCodeException, ZipCodeNotFoundException } from '../../../src/exceptions';
import ZipCodeAPIClient from '../../../src/api-clients/zip-code.api-client';
import APIClient from '../../../src/api-clients/api-client';

jest.mock('../../../src/api-clients/api-client');

const mockGet = jest.fn();
(APIClient.prototype as any).get = mockGet;

describe('ZipCodeAPIClient', () => {
  let client: ZipCodeAPIClient;

  beforeEach(() => {
    process.env.URL_ZIPCODE_API = 'https://mock-api.com';
    client = new ZipCodeAPIClient();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw error if URL_ZIPCODE_API is not set', () => {
    // Arrange
    delete process.env.URL_ZIPCODE_API;

    // Act & Assert
    expect(() => new ZipCodeAPIClient()).toThrow(
      'URL_ZIPCODE_API environment variable is required',
    );
  });

  it('should throw InvalidZipCodeException for invalid zip codes', async () => {
    // Arrange
    const invalidZipCodes = ['', '123', '1234567'];

    // Act & Assert
    for (const zipCode of invalidZipCodes) {
      await expect(client.getAddress(zipCode)).rejects.toThrow(InvalidZipCodeException);
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
    await expect(client.getAddress(zipCode)).rejects.toThrow(new ZipCodeNotFoundException(zipCode));
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
