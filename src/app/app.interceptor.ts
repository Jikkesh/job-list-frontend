import { HttpInterceptorFn } from '@angular/common/http';
import { HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export const appInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  // Check if the request URL already starts with 'http', which indicates an external URL
  if (req.url.startsWith('http')) {
    return next(req);  // If it's an absolute URL, no changes are needed
  }

  // Otherwise, clone the request and prepend the base API URL from the environment
  const updatedReq = req.clone({
    url: `${environment.apiUrl}/${req.url}`  // Use environment variable for the base URL
  });

  // Pass the updated request to the next handler
  return next(updatedReq);
};