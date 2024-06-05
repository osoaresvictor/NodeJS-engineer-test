import CustomerRepository from '../repositories/customer.repository';
import Customer from '../models/customer.model';
import { CreateCustomerBodyRequest, UpdateCustomerBodyRequest } from '../schemas/customer.schema';
import ZipCodeAPIClient from '../api-clients/zip-code.api-client';
import { CustomerNotFoundException } from '../exceptions';

class CustomerService {
  constructor(
    private customerRepository: CustomerRepository,
    private zipCodeAPIClient: ZipCodeAPIClient,
  ) {}

  async createCustomer(customerData: CreateCustomerBodyRequest) {
    const customer_address = await this.getCustomerAddress(
      customerData.zipcode,
      customerData.address_number,
    );
    const customer = new Customer(
      customerData.id,
      customerData.full_name,
      customerData.email,
      customer_address,
    );

    return await this.customerRepository.create(customer);
  }

  async getAllCustomers() {
    return await this.customerRepository.findAll();
  }

  async getCustomerById(id: number) {
    const customer = await this.customerRepository.findById(id);
    if (!customer) {
      throw new CustomerNotFoundException(id);
    }

    return customer;
  }

  async updateCustomer(id: number, customerData: Partial<UpdateCustomerBodyRequest>) {
    const customer: Partial<Customer> = {
      id: id,
      fullName: customerData.full_name,
      email: customerData.email,
    };

    if (customerData.zipcode) {
      const address = await this.getCustomerAddress(
        customerData.zipcode,
        customerData.address_number,
      );
      customer.address = address;
    }

    return await this.customerRepository.update(id, customer);
  }

  async deleteCustomer(id: number) {
    const customer = await this.customerRepository.findById(id);
    if (!customer) {
      throw new CustomerNotFoundException(id);
    }
    return await this.customerRepository.delete(id);
  }

  private async getCustomerAddress(zipCode: string, address_number: string = 'S/N') {
    const zipCodeData = await this.zipCodeAPIClient.getAddress(zipCode);
    const { address, district, city, state } = zipCodeData;
    const customer_address = `${address} ${address_number}, ${district} - ${city}/${state} - CEP: ${zipCode}`;

    return customer_address;
  }
}

export default CustomerService;
