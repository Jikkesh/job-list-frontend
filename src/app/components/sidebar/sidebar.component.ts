import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface RecommendedJob {
  id: string;
  title: string;
  company: string;
  salary: string;
}


@Component({
    selector: 'app-sidebar',
    imports: [CommonModule],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  recommendedJobs: RecommendedJob[] = [
    {
      id: '1',
      title: 'Senior React Developer',
      company: 'TechCorp',
      salary: '$90k - $120k',
    },
    {
      id: '2',
      title: 'Product Manager',
      company: 'InnovateCo',
      salary: '$100k - $130k',
    },
  ];

  // Get Jobs from parent
}
