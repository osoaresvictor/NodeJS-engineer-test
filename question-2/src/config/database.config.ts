import Customer from '../models/customer.model';
import { DataSource } from 'typeorm';

class Database {
  private static instance: DataSource;

  private constructor() {}

  public static getInstance(): DataSource {
    if (!Database.instance) {
      Database.instance = new DataSource({
        type: 'better-sqlite3',
        database: process.env.TEST_DATABASE ?? 'db/customers.db',
        entities: [Customer],
        synchronize: Boolean(process.env.SYNCHRONIZE_DB ?? 'false'),
        logging: false,
      });
    }
    return Database.instance;
  }

  public static async connect(): Promise<void> {
    try {
      if (!Database.instance) {
        Database.instance = Database.getInstance();
      }
      await Database.instance.initialize();
    } catch (err) {
      console.error('Error connecting to database', err);
      process.exit(1);
    }
  }
}

export default Database;
