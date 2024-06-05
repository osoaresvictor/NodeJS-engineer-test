import { FastifySchema } from 'fastify';

export type CreateCustomerBodyRequest = {
  id: number;
  full_name: string;
  email: string;
  zipcode: string;
  address_number: string;
};

export type UpdateCustomerBodyRequest = Omit<CreateCustomerBodyRequest, 'id'>;

const customerProperties = {
  id: { type: 'number' },
  fullName: { type: 'string' },
  email: { type: 'string' },
  address: { type: 'string' },
};

export const createCustomerSchema: FastifySchema = {
  summary: 'Create a new customer',
  body: {
    type: 'object',
    required: ['id', 'full_name', 'email', 'zipcode'],
    properties: {
      id: { type: 'number' },
      full_name: { type: 'string', minLength: 3 },
      email: { type: 'string', format: 'email' },
      zipcode: { type: 'string', minLength: 5, maxLength: 10 },
      address_number: { type: 'string', minLength: 1 },
    },
  },
  response: {
    201: {
      type: 'object',
      properties: customerProperties,
    },
  },
};

export const getCustomersSchema: FastifySchema = {
  summary: 'Get all customers',
  response: {
    200: {
      type: 'array',
      items: {
        type: 'object',
        properties: customerProperties,
      },
    },
  },
};

export const getCustomerByIdSchema: FastifySchema = {
  summary: 'Get a customer by ID',
  params: {
    type: 'object',
    properties: {
      id: { type: 'number' },
    },
    required: ['id'],
  },
  response: {
    200: {
      type: 'object',
      properties: customerProperties,
    },
    404: {
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
  },
};

export const updateCustomerByIdSchema: FastifySchema = {
  summary: 'Update a customer by ID',
  params: {
    type: 'object',
    properties: {
      id: { type: 'number' },
    },
    required: ['id'],
  },
  body: {
    type: 'object',
    required: [],
    properties: {
      full_name: { type: 'string', minLength: 3 },
      email: { type: 'string', format: 'email' },
      zipcode: { type: 'string', minLength: 5, maxLength: 10 },
      address_number: { type: 'string', minLength: 1 },
    },
  },
  response: {
    200: {
      type: 'object',
      properties: customerProperties,
    },
  },
};

export const deleteCustomerByIdSchema: FastifySchema = {
  summary: 'Delete a customer by ID',
  params: {
    type: 'object',
    properties: {
      id: { type: 'number' },
    },
    required: ['id'],
  },
  response: {
    200: {
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
    404: {
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
  },
};
