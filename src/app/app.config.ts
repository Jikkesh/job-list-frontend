import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { appInterceptor } from './app.interceptor';
import { provideMarkdown } from 'ngx-markdown';
import { provideClientHydration } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideMarkdown(),
    provideHttpClient(withInterceptors([appInterceptor])), provideClientHydration()
  ]
};