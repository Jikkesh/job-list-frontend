import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CardComponent } from '../card/card.component';
import { PaginationComponent } from '../pagination/pagination.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SkeletonCardComponent } from '../skeleton-card/skeleton-card.component';


@Component({
  selector: 'app-job-list',
  standalone: true,
  imports: [CardComponent, PaginationComponent, CommonModule, RouterModule, SkeletonCardComponent],
  templateUrl: './job-list.component.html',
  styleUrl: './job-list.component.css'
})
export class JobListComponent implements OnInit,  OnChanges {
  @Input() jobs: any;
  @Input() title!: string;
  @Input() to!: string;

  public currentPage = 1;
  public totalPages = 10;
  public noList: boolean = true
  public skeletonCount: number = 2

  onPageChange(newPage: number) {
    this.currentPage = newPage;
  }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {
    this.updateJobProfile()
  }


  updateJobProfile() {
    if (this.jobs && Array.isArray(this.jobs)) {
      this.jobs = this.jobs.map(job => ({
        id: job.id.toString(),
        title: job.job_role,
        company: job.company_name,
        company_image: job.image_url,
        location: `${job.city}, ${job.state}`, // Combine city and state
        salary: job.salary_package || 'Not disclosed',
        type: job.category,
        postedDate: '2 days ago', // Replace with actual date formatting
        description: this.trimDescription(job.job_description),
      }));
    } else {
      this.noList = true; // Show skeleton if jobs are not available
    }
    console.log("Jobs in List: ", this.jobs);
  }

  trimDescription(text: string): string {
    return text.split(' ').slice(0, 30).join(' ') + '...';
  }


}
