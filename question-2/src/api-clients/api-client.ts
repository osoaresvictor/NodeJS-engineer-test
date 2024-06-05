import axios, { AxiosResponse } from 'axios';
import CircuitBreaker from 'opossum';
import { StatusCodes } from 'http-status-codes';

export type APIClientOptions = {
  timeout?: number;
  errorThresholdPercentage?: number;
  resetTimeout?: number;
};

export class APIClient {
  protected baseUrl: string;
  private circuitBreaker: CircuitBreaker<[string], AxiosResponse<any>>;

  constructor(baseUrl: string, options?: APIClientOptions) {
    this.baseUrl = baseUrl;
    const circuitBreakerOptions: CircuitBreaker.Options = {
      timeout: options?.timeout ?? 5000,
      errorThresholdPercentage: options?.errorThresholdPercentage ?? 50,
      resetTimeout: options?.resetTimeout ?? 30000,
      errorFilter: (err) => {
        return (
          err.response.status === StatusCodes.NOT_FOUND ||
          err.response.status === StatusCodes.BAD_REQUEST
        );
      },
    };
    this.circuitBreaker = new CircuitBreaker(this.fetchData.bind(this), circuitBreakerOptions);
  }

  protected async fetchData(endpoint: string): Promise<AxiosResponse<any>> {
    return await axios.get<any>(`${this.baseUrl}${endpoint}`);
  }

  protected async get<T>(endpoint: string): Promise<T> {
    console.log(`Fetching data from ${this.baseUrl}${endpoint}`);

    try {
      const response = await this.circuitBreaker.fire(endpoint);
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch data: ${error.message}`);
      }
      throw error;
    }
  }
}

export default APIClient;
