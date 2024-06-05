export class ZipCodeNotFoundException extends Error {
  constructor(zipCode: string) {
    super(`The Zip Code ${zipCode} was not found`);
    this.name = 'ZipCodeNotFoundException';
  }
}
