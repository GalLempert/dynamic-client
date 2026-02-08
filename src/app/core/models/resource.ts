// src/app/core/models/resource.ts
export interface ResourceDefinition {
  name: string;
  schema: any; // JSON Schema
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  location: { lat: number; lng: number };
}

export interface Store {
  id: string;
  storeName: string;
  category: string;
  isOpen: boolean;
  location: { lat: number; lng: number };
}

export type Resource = User | Store;
