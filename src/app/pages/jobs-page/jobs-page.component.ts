import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JobListComponent } from '../../components/job-list/job-list.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { JobListService } from '../../services/job-list.service';
import { CommonModule } from '@angular/common';

interface Job {
  id: string;
  job_role: string;
  company_name: string;
  location: string;
  salary: string;
  type: string;  // 'fresher', 'internship', 'remote', 'part-time', or 'full-time'
  postedDate: string;
  description: string;
}

@Component({
  selector: 'app-jobs-page',
  standalone: true,
  imports: [JobListComponent, SidebarComponent,CommonModule],
  templateUrl: './jobs-page.component.html',
  styleUrls: ['./jobs-page.component.css'],
})
export class JobsPageComponent implements OnInit {
  title: string = '';
  type: string = 'all';
  jobs: Job[] = [];
  totalCount: number = 0;
  totalPages: number = 0;
  currentPage: number = 1;
  pageSize: number = 10; // Adjust as needed

  constructor(private route: ActivatedRoute, private jobService: JobListService) {}

  ngOnInit(): void {
    // Subscribe to route params to dynamically update content
    this.route.paramMap.subscribe((params) => {
      const routeType = params.get('type')?.toLowerCase();
      this.type =
        routeType && ['all', 'fresher', 'internship', 'remote', 'part-time', 'full-time'].includes(routeType)
          ? routeType
          : 'all';
      this.currentPage = 1; // Reset to page 1 on type change
      this.loadJobs();
    });
  }

  loadJobs(): void {
    // Convert type to capitalized form for display if needed
    this.type = this.capitalize(this.type);

    this.jobService.getJobsByCategory(this.type, this.currentPage, this.pageSize).subscribe(
      (data) => {
        this.jobs = data.jobs;
        this.totalCount = data.totalCount;
        this.totalPages = Math.ceil(data.totalCount / this.pageSize);

        this.title = this.type === 'all' ? 'All Jobs' : `${this.capitalize(this.type)} Jobs`;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  /**
   * Handle page changes
   */
  onPageChange(page: number): void {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadJobs();
    }
  }

  /**
   * Generate an array of page numbers for the template
   */
  getPages(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
