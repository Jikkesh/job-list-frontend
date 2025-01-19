import { Component, OnInit } from '@angular/core';
import { FormComponent } from '../../components/form/form.component';
import { ActivatedRoute } from '@angular/router';
import { DetailItemComponent } from '../../components/detail-item/detail-item.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-job-view',
  standalone: true,
  imports: [CommonModule,FormComponent,DetailItemComponent],
  templateUrl: './job-view.component.html',
  styleUrl: './job-view.component.css'
})
export class JobViewComponent implements OnInit  {
  job: any = {};

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    const jobId = this.route.snapshot.paramMap.get('id');
    this.loadJob(jobId);

    // Make it dynamic with Job with id API
  }

  loadJob(id: string | null): void {
    // Sample job data - Replace with actual API call to fetch job details using this.jobId
    this.job = {
      title: 'Senior Frontend Developer',
      company: 'TechCorp',
      companyLogo: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=128&h=128&fit=crop',
      location: 'Remote',
      salary: '4 - 7 LPA',
      type: 'Full-time',
      experience: '3-5 years',
      postedDate: '2 days ago',
      description: `We are seeking a talented Senior Frontend Developer to join our dynamic team...

      About the Role:
      As a Senior Frontend Developer, you will be responsible for building and maintaining high-quality web applications...

      Requirements:
      • 3+ years of experience with React
      • Strong understanding of modern JavaScript
      • Experience with TypeScript
      • Knowledge of responsive design and CSS frameworks
      
      Benefits:
      • Competitive salary
      • Health insurance
      • Flexible working hours
      • Remote work options
      • Professional development budget`,
      responsibilities: [
        'Lead frontend development initiatives',
        'Mentor junior developers',
        'Implement responsive designs',
        'Optimize application performance',
      ],
      qualifications: [
        "Bachelor's degree in Computer Science or related field",
        'Strong problem-solving skills',
        'Excellent communication abilities',
        'Experience with agile methodologies',
      ],
    };
  }

}
