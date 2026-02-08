import { ApplicationConfig, provideBrowserGlobalErrorListeners, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { mockBackendInterceptor } from './core/interceptors/mock-backend-interceptor';
import { ConfigService } from './core/services/config';
import { SchemaService } from './core/services/schema';

export function initializeApp(configService: ConfigService, schemaService: SchemaService) {
  return () => configService.loadConfig().then(() => schemaService.loadSchema());
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([mockBackendInterceptor])),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [ConfigService, SchemaService],
      multi: true
    }
  ]
};
