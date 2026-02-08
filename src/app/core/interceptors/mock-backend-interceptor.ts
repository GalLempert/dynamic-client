import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { CONFIG, SCHEMA, USERS, STORES } from '../mock-data';

let currentUsers = [...USERS];
let currentStores = [...STORES];

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

    if (query.includes('query Search')) {
      const resourceType = variables.resourceType;
      const term = variables.term || '';
      const field = variables.field || 'name';

      let results: any[] = [];
      if (resourceType === 'User') {
        results = currentUsers.filter(u =>
          (u as any)[field]?.toString().toLowerCase().includes(term.toLowerCase())
        );
      } else if (resourceType === 'Store') {
        results = currentStores.filter(s =>
          (s as any)[field]?.toString().toLowerCase().includes(term.toLowerCase())
        );
      }

      return of(new HttpResponse({ status: 200, body: { data: { search: results } } }));
    }

    if (query.includes('query Get')) {
        const resourceType = variables.resourceType;
        const id = variables.id;
        let item = null;
        if (resourceType === 'User') item = currentUsers.find(u => u.id === id);
        if (resourceType === 'Store') item = currentStores.find(s => s.id === id);

        return of(new HttpResponse({ status: 200, body: { data: { get: item } } }));
    }

    if (query.includes('mutation Update')) {
        const resourceType = variables.resourceType;
        const id = variables.id;
        const data = variables.data;

        if (resourceType === 'User') {
            const idx = currentUsers.findIndex(u => u.id === id);
            if (idx !== -1) {
                currentUsers[idx] = { ...currentUsers[idx], ...data };
                return of(new HttpResponse({ status: 200, body: { data: { update: currentUsers[idx] } } }));
            }
        }
        if (resourceType === 'Store') {
            const idx = currentStores.findIndex(s => s.id === id);
            if (idx !== -1) {
                currentStores[idx] = { ...currentStores[idx], ...data };
                return of(new HttpResponse({ status: 200, body: { data: { update: currentStores[idx] } } }));
            }
        }
    }

    if (query.includes('mutation Delete')) {
        const resourceType = variables.resourceType;
        const id = variables.id;

        if (resourceType === 'User') {
            currentUsers = currentUsers.filter(u => u.id !== id);
        }
        if (resourceType === 'Store') {
            currentStores = currentStores.filter(s => s.id !== id);
        }
        return of(new HttpResponse({ status: 200, body: { data: { delete: true } } }));
    }
  }

  // Pass through
  return next(req);
};
