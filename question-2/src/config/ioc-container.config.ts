import { createContainer, asClass, InjectionMode } from 'awilix';
import CustomerRepository from '../repositories/customer.repository';
import CustomerService from '../services/customer.service';
import CustomerController from '../controllers/customer.controller';
import ZipCodeAPIClient from '../api-clients/zip-code.api-client';

const iocContainer = createContainer({ injectionMode: InjectionMode.CLASSIC });

iocContainer.register({
  customerRepository: asClass(CustomerRepository).scoped(),
  zipCodeAPIClient: asClass(ZipCodeAPIClient).scoped(),
  customerService: asClass(CustomerService).scoped(),
  customerController: asClass(CustomerController).scoped(),
});

export default iocContainer;
