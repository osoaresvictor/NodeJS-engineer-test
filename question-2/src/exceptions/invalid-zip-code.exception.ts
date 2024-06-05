export class InvalidZipCodeException extends Error {
  constructor(message: string = 'Invalid Zip Code') {
    super(message);
    this.name = 'InvalidZipCodeException';
  }
}
