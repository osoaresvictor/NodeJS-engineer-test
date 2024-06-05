export class CustomerNotFoundException extends Error {
  constructor(id: number) {
    super(`Customer '${id}' not found`);
    this.name = 'InvalidZipCodeException';
  }
}
