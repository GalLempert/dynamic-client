// src/app/core/mock-data.ts
import { ResourceDefinition, User, Store } from './models/resource';

export const CONFIG = {
  apiEndpoint: '/api'
};

export const SCHEMA: { resources: ResourceDefinition[] } = {
  resources: [
    {
      name: 'User',
      schema: {
        type: 'object',
        properties: {
          id: { type: 'string', readOnly: true },
          name: { type: 'string' },
          email: { type: 'string' },
          role: { type: 'string' },
          location: {
            type: 'object',
            properties: {
              lat: { type: 'number' },
              lng: { type: 'number' }
            }
          }
        },
        required: ['id', 'name', 'location']
      }
    },
    {
      name: 'Store',
      schema: {
        type: 'object',
        properties: {
          id: { type: 'string', readOnly: true },
          storeName: { type: 'string' },
          category: { type: 'string' },
          isOpen: { type: 'boolean' },
          location: {
            type: 'object',
            properties: {
              lat: { type: 'number' },
              lng: { type: 'number' }
            }
          }
        },
        required: ['id', 'storeName', 'location']
      }
    }
  ]
};

export const USERS: User[] = [
  { id: '1', name: 'Alice', email: 'alice@example.com', role: 'Admin', location: { lat: 40.7128, lng: -74.0060 } },
  { id: '2', name: 'Bob', email: 'bob@example.com', role: 'User', location: { lat: 34.0522, lng: -118.2437 } },
];

export const STORES: Store[] = [
  { id: 's1', storeName: 'SuperMart', category: 'Grocery', isOpen: true, location: { lat: 51.5074, lng: -0.1278 } },
  { id: 's2', storeName: 'TechHub', category: 'Electronics', isOpen: false, location: { lat: 35.6895, lng: 139.6917 } },
];
