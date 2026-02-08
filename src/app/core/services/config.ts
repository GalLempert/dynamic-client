import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface AppConfig {
  apiEndpoint: string;
}

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private config: AppConfig | null = null;

  constructor(private http: HttpClient) {}

  async loadConfig(): Promise<void> {
    try {
      this.config = await firstValueFrom(this.http.get<AppConfig>('/config.json'));
    } catch (e) {
      console.error('Failed to load config', e);
      // Fallback or rethrow
      this.config = { apiEndpoint: '/api' };
    }
  }

  get apiEndpoint(): string {
    return this.config?.apiEndpoint || '';
  }
}
