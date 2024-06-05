import Database from '../config/database.config';
import Customer from '../models/customer.model';

class CustomerRepository {
  private readonly customerRepo = Database.getInstance().getRepository(Customer);

  async create(customer: Customer): Promise<Customer> {
    const newCustomer = this.customerRepo.create(customer);
    await this.customerRepo.save(newCustomer);
    return newCustomer;
  }

  async findAll(): Promise<Customer[]> {
    return await this.customerRepo.find();
  }

  async findById(id: number): Promise<Customer | null> {
    return await this.customerRepo.findOneBy({ id: id });
  }

  async update(id: number, customer: Partial<Customer>): Promise<Customer | null> {
    await this.customerRepo.update(id, customer);
    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.customerRepo.delete(id);
  }
}

export default CustomerRepository;
