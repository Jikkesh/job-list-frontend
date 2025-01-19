import { Component, Input } from '@angular/core';
import { CardComponent } from '../card/card.component';
import { PaginationComponent } from '../pagination/pagination.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  postedDate: string;
  description: string;
}

@Component({
  selector: 'app-job-list',
  standalone: true,
  imports: [CardComponent,PaginationComponent,CommonModule,RouterModule],
  templateUrl: './job-list.component.html',
  styleUrl: './job-list.component.css'
})
export class JobListComponent {
  @Input() jobs: Job[] = [];
  @Input() title!: string;
  @Input() to!: string;

  currentPage = 1;
  totalPages = 10;

  onPageChange(newPage: number) {
    this.currentPage = newPage;
  }

}
