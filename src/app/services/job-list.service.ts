import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JobListService {

  private BASE_URL = 'jobs';  // Base URL for API

  constructor(private httpClient: HttpClient) { }

  // Get all jobs
  public getAllJobs(): Observable<any> {
    return this.httpClient.get(`${this.BASE_URL}/`).pipe(
      catchError(error => throwError(() => error))
    );
  }

  // Get initial top 5 jobs in each category
  public getTopJobs(): Observable<any> {
    return this.httpClient.get(`${this.BASE_URL}/top_jobs`).pipe(
      catchError(error => throwError(() => error))
    );
  }

  // Get Job list by Category
  public getJobsByCategory(category: string, page: number, size: number): Observable<any> {
    return this.httpClient.get(`${this.BASE_URL}/category/${category}?page=${page}&size=${size}`).pipe(
      catchError(error => {
        console.error(error);
        throw error;
      })
    );
  }


  // Get job by ID
  public getJobById(jobId: number): Observable<any> {
    return this.httpClient.get(`${this.BASE_URL}/${jobId}`).pipe(
      catchError(error => throwError(() => error))
    );
  }
}