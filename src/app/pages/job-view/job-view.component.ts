import { Component, OnInit } from '@angular/core';
import { FormComponent } from '../../components/form/form.component';
import { ActivatedRoute } from '@angular/router';
import { DetailItemComponent } from '../../components/detail-item/detail-item.component';
import { CommonModule } from '@angular/common';
import { JobListService } from '../../services/job-list.service';
import { MarkdownModule } from 'ngx-markdown';
import { JobImageCacheService } from '../../services/job-image-cache.service';

@Component({
  selector: 'app-job-view',
  standalone: true,
  imports: [CommonModule,FormComponent,DetailItemComponent,MarkdownModule],
  templateUrl: './job-view.component.html',
  styleUrl: './job-view.component.css'
})
export class JobViewComponent implements OnInit  {
  job: any = null;
  jobImages : any = null;
  total_applied: number = 55;
  date_posted: string = "2021-07-01";

  constructor(private route: ActivatedRoute, private jobImageCache : JobImageCacheService,private joblistService : JobListService) { }

  ngOnInit(): void {
    const jobId = this.route.snapshot.paramMap.get('id');
    console.log("Loaded Id: ", jobId);  
    if (jobId) {
      this.getJobById(parseInt(jobId));
      this.fetchJobImages(jobId);
    }
  }

  getJobById(jobId: number): void {
    this.joblistService.getJobById(jobId).subscribe((data) => {
      this.job = data;
    });      
    }

    private fetchJobImages(jobId:any): void {
      this.jobImageCache.getImage(jobId).then(
        (base64) => {
          this.jobImages = base64;
        },
        (error) => {
          console.error('Error fetching company logo:', error);
          this.jobImages = 'assets/hiring.png';
        }
      );
    }

    


}
