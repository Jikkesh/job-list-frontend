import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JobListComponent } from '../../components/job-list/job-list.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { JobListService } from '../../services/job-list.service';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string; // Example: 'fresher', 'internship', 'remote', 'part-time', or 'full-time'
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

  // jobs: Job[] = [
  //   {
  //     id: '1',
  //     title: 'Frontend Developer',
  //     company: 'TechCorp',
  //     location: 'Remote',
  //     salary: '$80k - $100k',
  //     type: 'remote',
  //     postedDate: '2 days ago',
  //     description: 'We are looking for a skilled frontend developer...',
  //   },
  //   {
  //     id: '2',
  //     title: 'Product Manager',
  //     company: 'InnovateCo',
  //     location: 'New York',
  //     salary: '$120k - $150k',
  //     type: 'full-time',
  //     postedDate: '1 day ago',
  //     description: 'Seeking an experienced product manager...',
  //   },
  //   {
  //     id: '3',
  //     title: 'Intern Software Engineer',
  //     company: 'CodeLabs',
  //     location: 'San Francisco',
  //     salary: '$20/hour',
  //     type: 'internship',
  //     postedDate: '3 days ago',
  //     description: 'Looking for an intern to join our team...',
  //   },
  // ];

  // filteredJobs: Job[] = [];

  constructor(private route: ActivatedRoute, private jobService: JobListService) {}

  ngOnInit(): void {
    // Subscribe to route params to dynamically update content
    this.route.paramMap.subscribe((params) => {
      const routeType = params.get('type')?.toLowerCase();
      this.type = routeType && ['all', 'fresher', 'internship', 'remote', 'part-time'].includes(routeType)
        ? routeType
        : 'all';
        this.loadJobs();
    });

    // Call API with category with Pagination functnality
    // Call Sidebar API call to, some what matching list jobs they can visit.
  }

  loadJobs(): void {
    this.type = this.capitalize(this.type)
    this.jobService.getJobsByCategory(this.type, this.currentPage, this.pageSize).subscribe(
      (data) => {
        this.jobs = data.jobs;
        this.totalCount = data.total_count;
        this.totalPages = data.total_pages;
        this.title = this.type === 'all' ? 'All Jobs' : `${this.capitalize(this.type)} Jobs`;
        console.log("Jobs: ",this.jobs)
        console.log("Jobs Count: ",this.totalCount)
      },
      (error) => {
        console.error(error);
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
