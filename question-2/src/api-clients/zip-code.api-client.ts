import { InvalidZipCodeException, ZipCodeNotFoundException } from '../exceptions';
import APIClient from './api-client';

type AddressResponse = {
  cep: string;
  address_type: string;
  address_name: string;
  address: string;
  state: string;
  district: string;
  lat: string;
  lng: string;
  city: string;
  city_ibge: string;
  ddd: string;
  code?: string;
  message?: string;
};

class ZipCodeAPIClient extends APIClient {
  constructor() {
    const baseUrl = process.env.URL_ZIPCODE_API;
    if (!baseUrl) {
      throw new Error('URL_ZIPCODE_API environment variable is required');
    }

    super(baseUrl);
  }

  public async getAddress(zipCode: string): Promise<AddressResponse> {
    if (!zipCode || zipCode.length < 8) {
      throw new InvalidZipCodeException();
    }

    try {
      const result = await this.get<AddressResponse>(zipCode);
      return result;
    } catch (error: any) {
      if (error.message.includes('404')) {
        throw new ZipCodeNotFoundException(zipCode);
      }

      throw error;
    }
  }
}

export default ZipCodeAPIClient;
