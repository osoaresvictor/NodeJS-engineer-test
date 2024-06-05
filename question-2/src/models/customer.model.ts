import { PrimaryColumn, Column, Entity } from 'typeorm';

@Entity()
class Customer {
  @PrimaryColumn()
  id!: number;

  @Column()
  fullName!: string;

  @Column()
  email!: string;

  @Column()
  address!: string;

  constructor(id: number, fullName: string, email: string, address: string) {
    this.id = id;
    this.fullName = fullName;
    this.email = email;
    this.address = address;
  }
}

export default Customer;
