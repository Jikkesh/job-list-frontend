import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JobListService {
  httpClient: any;

  constructor() { }

  public getJobList(data:any):Observable<any>{
    return this.httpClient.get('api/chatbot/get_response', data).pipe(tap(res => {
      return res;
    }), catchError(error => throwError(error)));
  }




}
