import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient, private configService: ConfigService) {}

  private get graphqlUrl() {
    return `${this.configService.apiEndpoint}/graphql`;
  }

  search(resourceType: string, term: string, field: string): Observable<any[]> {
    const query = `
      query Search($resourceType: String!, $term: String!, $field: String!) {
        search(resourceType: $resourceType, term: $term, field: $field)
      }
    `;
    return this.http.post<any>(this.graphqlUrl, {
      operationName: 'Search',
      query,
      variables: { resourceType, term, field }
    }).pipe(
      tap(res => console.log('API Response:', res)),
      map(res => res.data.search)
    );
  }

  get(resourceType: string, id: string): Observable<any> {
    const query = `
      query Get($resourceType: String!, $id: ID!) {
        get(resourceType: $resourceType, id: $id)
      }
    `;
    return this.http.post<any>(this.graphqlUrl, {
      operationName: 'Get',
      query,
      variables: { resourceType, id }
    }).pipe(
      map(res => res.data.get)
    );
  }

  update(resourceType: string, id: string, data: any): Observable<any> {
    const query = `
      mutation Update($resourceType: String!, $id: ID!, $data: JSON!) {
        update(resourceType: $resourceType, id: $id, data: $data)
      }
    `;
    return this.http.post<any>(this.graphqlUrl, {
      operationName: 'Update',
      query,
      variables: { resourceType, id, data }
    }).pipe(
      map(res => res.data.update)
    );
  }

  delete(resourceType: string, id: string): Observable<boolean> {
    const query = `
      mutation Delete($resourceType: String!, $id: ID!) {
        delete(resourceType: $resourceType, id: $id)
      }
    `;
    return this.http.post<any>(this.graphqlUrl, {
      operationName: 'Delete',
      query,
      variables: { resourceType, id }
    }).pipe(
      map(res => res.data.delete)
    );
  }
}
