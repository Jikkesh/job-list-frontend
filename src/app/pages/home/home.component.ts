import { Component, ElementRef, OnInit, ViewChild, OnDestroy, AfterViewInit, Renderer2 } from '@angular/core';
import { JobListComponent } from '../../components/job-list/job-list.component';
import { HeroComponent } from '../../components/hero/hero.component';
import { JobSectionComponent } from '../../components/job-section/job-section.component';
import { CommonModule } from '@angular/common';
import { JobListService } from '../../services/job-list.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [JobListComponent, HeroComponent, JobSectionComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  public internship_jobs: any
  public fresher_jobs: any
  public remote_jobs: any;
  public part_time_jobs: any;


  public features: any = [
    {
      title: "AI-Powered Listing",
      description: "Our advanced AI powered gets the job listings from various Company career sites."
    },
    {
      title: "Time is Key",
      description: "All companies on our platform are thoroughly verified to ensure legitimate opportunities."
    },
    {
      title: "Start Up Connect",
      description: "We have a solid connection with many start-up for vacancy alerts."
    }
  ];

  public recentJobs = [
    { id: '1', 
      title: 'Frontend Developer', 
      company: 'TechCorp', 
      location: 'Remote', 
      salary: '$80k - $100k', 
      type: 'Full-time', 
      postedDate: '2 days ago', 
      description: 'We are looking for a skilled frontend developer with React experience...' 
    },
    { id: '2', 
      title: 'Product Manager', 
      company: 'InnovateCo', 
      location: 'New York', 
      salary: '$120k - $150k', 
      type: 'Full-time', 
      postedDate: '1 day ago', 
      description: 'Seeking an experienced product manager to lead our flagship product...' 
    },
  ];


  constructor(private jobService: JobListService){}


  ngOnInit(): void {
    this.jobService.getTopJobs().subscribe((res) => {
      console.log("Category Res: ",res.fresher[0])
      this.fresher_jobs = res.fresher[0].jobs_data
      this.internship_jobs = res.internship[0].jobs_data
      this.remote_jobs = res.remote[0].jobs_data
      this.part_time_jobs = res.part_time[0].jobs_data
    })

    console.log(this.fresher_jobs)
  }


  // Connect with Category top 5 APP_ID
}
