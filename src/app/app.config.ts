// src/app/app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { routes } from './app.routes';

// <-- NEW imports -->
import { provideServerRendering } from '@angular/platform-server';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';
import { appInterceptor } from './app.interceptor';
import { provideMarkdown } from 'ngx-markdown';
import { provideClientHydration } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    // ← kick off Angular Universal on the server
    provideServerRendering(),

    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled',
      })
    ),

    provideMarkdown(),

    provideHttpClient(
      withInterceptors([appInterceptor]),
      withFetch(),                  // your existing fetch-based HTTP support
    ),

    provideClientHydration(),
  ]
};