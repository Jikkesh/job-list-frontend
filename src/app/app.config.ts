import { ApplicationConfig } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';
import { appInterceptor } from './app.interceptor';
import { provideMarkdown } from 'ngx-markdown';
import { provideClientHydration } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled',  
      })
    ),

    provideMarkdown(),
    provideHttpClient(withInterceptors([appInterceptor]), withFetch()),
    provideClientHydration(),
  ]
};
