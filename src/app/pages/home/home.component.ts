import { Component, OnInit } from '@angular/core';
import { HeroComponent } from '../../components/hero/hero.component';
import { JobSectionComponent } from '../../components/job-section/job-section.component';
import { CommonModule } from '@angular/common';
import { JobListService } from '../../services/job-list.service';
import { map, Observable, shareReplay, catchError, of, tap } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeroComponent, JobSectionComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  public internship_jobs!: Observable<any[]>;
  public fresher_jobs!: Observable<any[]>;
  public remote_jobs!: Observable<any[]>;
  public part_time_jobs!: Observable<any[]>;

  public features = [
    {
      title: "AI-Powered Listing",
      description: "Our advanced AI powered system fetches job listings from various sources."
    },
    {
      title: "Time is Key",
      description: "All companies on our platform are thoroughly verified to ensure legitimate opportunities."
    },
    {
      title: "Start Up Connect",
      description: "We have a solid connection with many start-ups for vacancy alerts."
    }
  ];

  constructor(private jobService: JobListService) {}

  ngOnInit(): void {
    // Share the API call to avoid multiple requests and cache response
    const topJobs$ = this.jobService.getTopJobs().pipe(
      shareReplay(1), // Cache the response for multiple subscriptions
      catchError(error => {
        console.error('API Error:', error);
        return of({}); // Return empty object on error
      })
    );

    // Map each job type with proper error handling
    this.fresher_jobs = topJobs$.pipe(
      map(res => this.extractJobsData(res, 'fresher'))
    );
    
    this.internship_jobs = topJobs$.pipe(
      map(res => this.extractJobsData(res, 'internship'))
    );
    
    this.remote_jobs = topJobs$.pipe(
      map(res => this.extractJobsData(res, 'remote'))
    );
    
    this.part_time_jobs = topJobs$.pipe(
      map(res => this.extractJobsData(res, 'part_time'))
    );
  }

  private extractJobsData(response: any, jobType: string): any[] {
    try {
      const data = response[jobType];
      
      // Handle different possible response structures
      if (!data) return [];
      
      // If data is already an array of jobs
      if (Array.isArray(data) && data.length > 0 && data[0].jobs_data) {
        return data[0].jobs_data || [];
      }
      
      // If data is direct jobs array
      if (Array.isArray(data)) {
        return data;
      }
      
      // If data has jobs_data property directly
      if (data.jobs_data && Array.isArray(data.jobs_data)) {
        return data.jobs_data;
      }
      
      return [];
    } catch (error) {
      console.error(`Error extracting ${jobType} jobs:`, error);
      return [];
    }
  }

}