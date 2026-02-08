import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config';
import { firstValueFrom, BehaviorSubject } from 'rxjs';

export interface ResourceDefinition {
  name: string;
  schema: any; // JSON Schema
}

export interface SchemaResponse {
  resources: ResourceDefinition[];
}

@Injectable({
  providedIn: 'root',
})
export class SchemaService {
  private resourcesSubject = new BehaviorSubject<ResourceDefinition[]>([]);
  public resources$ = this.resourcesSubject.asObservable();

  // Mapping of ResourceName -> DefaultSearchField
  private defaultSearchFields: Map<string, string> = new Map();

  constructor(private http: HttpClient, private configService: ConfigService) {}

  async loadSchema(): Promise<void> {
    const endpoint = this.configService.apiEndpoint;
    try {
      const response = await firstValueFrom(this.http.get<SchemaResponse>(`${endpoint}/schema`));
      this.resourcesSubject.next(response.resources);

      // Initialize default search fields if not set
      response.resources.forEach(res => {
        if (!this.defaultSearchFields.has(res.name)) {
          // Heuristic: try to find 'name' or 'title' or take the first string property
           const props = res.schema.properties || {};
           const candidate = Object.keys(props).find(k => k.toLowerCase().includes('name')) || Object.keys(props)[0];
           this.defaultSearchFields.set(res.name, candidate || 'id');
        }
      });
    } catch (e) {
      console.error('Failed to load schema', e);
    }
  }

  getResource(name: string): ResourceDefinition | undefined {
    return this.resourcesSubject.value.find(r => r.name === name);
  }

  getDefaultSearchField(resourceName: string): string {
    return this.defaultSearchFields.get(resourceName) || 'id';
  }

  setDefaultSearchField(resourceName: string, field: string) {
    this.defaultSearchFields.set(resourceName, field);
  }
}
