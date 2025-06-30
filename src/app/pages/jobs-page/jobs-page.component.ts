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
  type: string;  // 'fresher', 'internship', 'remote', 'experienced', or 'full-time'
  postedDate: string;
  description: string;
}

@Component({
  selector: 'app-jobs-page',
  standalone: true,
  imports: [JobListComponent, CommonModule],
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
  pageSize: number = 10;

  constructor(private route: ActivatedRoute, private jobService: JobListService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const routeType = params.get('type')?.toLowerCase();
      this.type =
        routeType && ['all', 'fresher', 'internship', 'remote', 'experienced', 'full-time'].includes(routeType)
          ? routeType
          : 'all';
      this.currentPage = 1;
      this.loadJobs();
    });
  }

  loadJobs(): void {
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

  onPageChange(page: number): void {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadJobs();
    }
  }

  /**
   * Generate mobile pagination (fewer pages for small screens)
   */
  getMobilePages(): (number | string)[] {
    const pages: (number | string)[] = [];
    const maxVisible = 3;

    if (this.totalPages <= maxVisible) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (this.currentPage > 2) {
        pages.push('ellipsis');
      }

      // Show current page if not first or last
      if (this.currentPage !== 1 && this.currentPage !== this.totalPages) {
        pages.push(this.currentPage);
      }

      if (this.currentPage < this.totalPages - 1) {
        pages.push('ellipsis');
      }

      // Always show last page (if more than 1 page total)
      if (this.totalPages > 1) {
        pages.push(this.totalPages);
      }
    }

    return pages;
  }

  /**
   * Generate tablet pagination (medium number of pages)
   */
  getTabletPages(): (number | string)[] {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (this.totalPages <= maxVisible) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      const startPage = Math.max(2, this.currentPage - 1);
      const endPage = Math.min(this.totalPages - 1, startPage + 2);

      if (startPage > 2) {
        pages.push('ellipsis');
      }

      for (let i = startPage; i <= endPage; i++) {
        if (i !== 1 && i !== this.totalPages) {
          pages.push(i);
        }
      }

      if (endPage < this.totalPages - 1) {
        pages.push('ellipsis');
      }

      if (this.totalPages > 1) {
        pages.push(this.totalPages);
      }
    }

    return pages;
  }

  /**
   * Generate desktop pagination (more pages for larger screens)
   */
  getDesktopPages(): (number | string)[] {
    const pages: (number | string)[] = [];
    const maxVisible = 7;

    if (this.totalPages <= maxVisible) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      const startPage = Math.max(2, this.currentPage - 2);
      const endPage = Math.min(this.totalPages - 1, startPage + 4);

      if (startPage > 2) {
        pages.push('ellipsis');
      }

      for (let i = startPage; i <= endPage; i++) {
        if (i !== 1 && i !== this.totalPages) {
          pages.push(i);
        }
      }

      if (endPage < this.totalPages - 1) {
        pages.push('ellipsis');
      }

      if (this.totalPages > 1) {
        pages.push(this.totalPages);
      }
    }

    return pages;
  }

  /**
   * Check if a page item is a number (clickable page)
   */
  isPageNumber(page: number | string): page is number {
    return typeof page === 'number';
  }

  /**
   * Calculate the range of results being shown
   */
  getResultsRange(): { start: number; end: number } {
    const start = (this.currentPage - 1) * this.pageSize + 1;
    const end = Math.min(this.currentPage * this.pageSize, this.totalCount);
    return { start, end };
  }

  capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}