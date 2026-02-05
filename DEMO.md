# Dynamic Client Demo

This Angular application demonstrates a dynamic client that introspects an API to build its UI.

## How to Run

1. `npm install`
2. `npm start`
3. Navigate to `http://localhost:4200`

## Features Verified

1. **Startup**: Loads configuration from `/config.json` (mocked).
2. **Introspection**: Loads schema from `/api/schema` (mocked).
3. **Search**:
   - Landing page allows searching `User` and `Store` resources.
   - Default search field is configurable via Admin.
   - Mock backend supports searching.
4. **Detail View**:
   - Split view with Map (Left) and Form (Right).
   - Map shows location using Leaflet.
   - Form is generated dynamically from JSON Schema.
5. **Editing**:
   - Toggle Edit mode.
   - Update fields (mocked persistence).
   - Delete resource.
6. **Admin**:
   - `/admin` page to configure default search fields.

## Mock Data
- Users: Alice, Bob
- Stores: SuperMart, TechHub
