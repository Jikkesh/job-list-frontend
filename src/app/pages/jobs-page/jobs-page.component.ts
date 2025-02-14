import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JobListComponent } from '../../components/job-list/job-list.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { JobListService } from '../../services/job-list.service';

interface Job {
  id: string;
  job_role: string;
  company_name: string;
  location: string;
  salary: string;
  type: string; //'fresher', 'internship', 'remote', 'part-time', or 'full-time'
  postedDate: string;
  description: string;
}

@Component({
  selector: 'app-jobs-page',
  standalone: true,
  imports: [JobListComponent, SidebarComponent],
  templateUrl: './jobs-page.component.html',
  styleUrls: ['./jobs-page.component.css'],
})
export class JobsPageComponent implements OnInit {
  title: string = '';
  type: string = 'all';
  jobs: Job[] = [];
  filteredJobs: Job[] = [];
  totalCount: number = 0;
  totalPages: number = 0;
  currentPage: number = 1;
  pageSize: number = 10;

  constructor(private route: ActivatedRoute, private jobService: JobListService) { }

  ngOnInit(): void {
    // Subscribe to route params to dynamically update content
    this.route.paramMap.subscribe((params) => {
      const routeType = params.get('type')?.toLowerCase();
      this.type = routeType && ['all', 'fresher', 'internship', 'remote', 'part-time', 'full-time'].includes(routeType)
        ? routeType
        : 'all';
      this.loadJobs();
    });

    // Call Sidebar API call to, some what matching list jobs they can visit.
  }

  loadJobs(): void {
    this.type = this.capitalize(this.type)

    this.jobService.getJobsByCategory(this.type, this.currentPage, this.pageSize).subscribe(
      (data) => {
        this.jobs = data.jobs; 
        this.totalCount = data.totalCount; 
        this.totalPages = Math.ceil(data.totalCount / this.pageSize); 
        this.title = this.type === 'all' ? 'All Jobs' : `${this.capitalize(this.type)} Jobs`;
        
        console.log("Jobs: ", this.jobs);
        console.log("Jobs Count: ", this.totalCount);
      },
      (error) => {
        console.error(error); // Log and handle errors
        // Add user-friendly error handling if needed
      }
    );

  }

  // Function to handle page change
  onPageChange(page: number): void {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadJobs();
    }
  }

  // Utility function to capitalize the first letter of a string
  capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
