import { Component, OnInit } from '@angular/core';
import { JobListComponent } from '../../components/job-list/job-list.component';
import { HeroComponent } from '../../components/hero/hero.component';
import { JobSectionComponent } from '../../components/job-section/job-section.component';
import { CommonModule } from '@angular/common';
import { JobListService } from '../../services/job-list.service';
import { map, Observable } from 'rxjs';

@Component({
    selector: 'app-home',
    imports: [JobListComponent, HeroComponent, JobSectionComponent, CommonModule],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  public internship_jobs!: Observable<any>;
  public fresher_jobs!: Observable<any>;
  public remote_jobs!: Observable<any>;
  public part_time_jobs!: Observable<any>;

  

  public features = [
    {
      title: "AI-Powered Listing",
      description: "Our advanced AI powered system fetches job listings from various company career sites."
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
    const topJobs$ = this.jobService.getTopJobs();
    
    this.fresher_jobs = topJobs$.pipe(map(res => res.fresher?.[0]?.jobs_data ?? []));
    this.internship_jobs = topJobs$.pipe(map(res => res.internship?.[0]?.jobs_data ?? []));
    this.remote_jobs = topJobs$.pipe(map(res => res.remote?.[0]?.jobs_data ?? []));
    this.part_time_jobs = topJobs$.pipe(map(res => res.part_time?.[0]?.jobs_data ?? []));
  }
}
