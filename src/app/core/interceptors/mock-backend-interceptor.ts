import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

// Mock Data
const CONFIG = {
  apiEndpoint: '/api'
};

const SCHEMA = {
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

let USERS = [
  { id: '1', name: 'Alice', email: 'alice@example.com', role: 'Admin', location: { lat: 40.7128, lng: -74.0060 } }, // NYC
  { id: '2', name: 'Bob', email: 'bob@example.com', role: 'User', location: { lat: 34.0522, lng: -118.2437 } }, // LA
];

let STORES = [
  { id: 's1', storeName: 'SuperMart', category: 'Grocery', isOpen: true, location: { lat: 51.5074, lng: -0.1278 } }, // London
  { id: 's2', storeName: 'TechHub', category: 'Electronics', isOpen: false, location: { lat: 35.6895, lng: 139.6917 } }, // Tokyo
];

export const mockBackendInterceptor: HttpInterceptorFn = (req, next) => {
  const { url, method, body } = req;
  console.log('Intercept request:', method, url);

  // Mock Config
  if (url.endsWith('/config.json') && method === 'GET') {
    return of(new HttpResponse({ status: 200, body: CONFIG }));
  }

  // Mock Schema
  if (url.endsWith('/api/schema') && method === 'GET') {
    return of(new HttpResponse({ status: 200, body: SCHEMA }));
  }

  // Mock GraphQL
  if (url.endsWith('/api/graphql') && method === 'POST') {
    const gqlBody = body as any;
    const operationName = gqlBody.operationName || '';
    const query = gqlBody.query || '';
    const variables = gqlBody.variables || {};

    console.log('GraphQL Mock:', operationName, variables);

    // Search Query (Generic for demo, usually specific to resource)
    // Assuming query like "query SearchUsers..." or "query SearchStores..."
    // Or we handle a generic "search" query if we implemented it that way.
    // Let's assume the client sends a query based on resource name.

    if (query.includes('query Search')) {
      const resourceType = variables.resourceType; // Passed from client
      const term = variables.term || '';
      const field = variables.field || 'name'; // simplistic default

      let results: any[] = [];
      if (resourceType === 'User') {
        results = USERS.filter(u =>
          (u as any)[field]?.toString().toLowerCase().includes(term.toLowerCase())
        );
      } else if (resourceType === 'Store') {
        results = STORES.filter(s =>
          (s as any)[field]?.toString().toLowerCase().includes(term.toLowerCase())
        );
      }

      return of(new HttpResponse({ status: 200, body: { data: { search: results } } }));
    }

    if (query.includes('query Get')) {
        const resourceType = variables.resourceType;
        const id = variables.id;
        let item = null;
        if (resourceType === 'User') item = USERS.find(u => u.id === id);
        if (resourceType === 'Store') item = STORES.find(s => s.id === id);

        return of(new HttpResponse({ status: 200, body: { data: { get: item } } }));
    }

    if (query.includes('mutation Update')) {
        const resourceType = variables.resourceType;
        const id = variables.id;
        const data = variables.data;

        if (resourceType === 'User') {
            const idx = USERS.findIndex(u => u.id === id);
            if (idx !== -1) {
                USERS[idx] = { ...USERS[idx], ...data };
                return of(new HttpResponse({ status: 200, body: { data: { update: USERS[idx] } } }));
            }
        }
        if (resourceType === 'Store') {
            const idx = STORES.findIndex(s => s.id === id);
            if (idx !== -1) {
                STORES[idx] = { ...STORES[idx], ...data };
                return of(new HttpResponse({ status: 200, body: { data: { update: STORES[idx] } } }));
            }
        }
    }

    if (query.includes('mutation Delete')) {
        const resourceType = variables.resourceType;
        const id = variables.id;

        if (resourceType === 'User') {
            USERS = USERS.filter(u => u.id !== id);
        }
        if (resourceType === 'Store') {
            STORES = STORES.filter(s => s.id !== id);
        }
        return of(new HttpResponse({ status: 200, body: { data: { delete: true } } }));
    }
  }

  // Pass through other requests (e.g., assets)
  return next(req);
};
