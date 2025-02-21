import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { JobListService } from '../../services/job-list.service';
import { JobImageCacheService } from '../../services/job-image-cache.service';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent implements OnInit {
  @Input() id!: string;
  @Input() title!: string;
  @Input() company!: string;
  @Input() companyLogo!: string;  
  @Input() location!: string;
  @Input() salary!: string;
  @Input() type!: string;
  @Input() postedDate!: string;
  @Input() description!: string;


  public logoUrl: string = 'assets/hiring.png';  // Default logo

  constructor(private jobService: JobListService, private jobImageCache : JobImageCacheService){}

  ngOnInit(): void {
    this.loadCompanyLogo();
  }

  private loadCompanyLogo(): void {
    const cachedImage = localStorage.getItem(`companyLogo_${this.id}`);

    if (cachedImage) {
      this.logoUrl = cachedImage;
    } else {
      this.fetchImageCache();
    }
  }

  private fetchCompanyLogo(): void {
    this.jobService.getJobImage(this.id).subscribe(
      (blob) => {
        const imageUrl = URL.createObjectURL(blob);
        localStorage.setItem(`jobImage_${this.id}`, imageUrl);
        this.logoUrl = imageUrl;
      },
      (error) => {
        console.error('Error fetching company logo:', error);
      }
    );
  }

  private fetchImageCache(): void {
    this.jobImageCache.getImage(this.id).then(
      (base64) => {
        this.logoUrl = base64;
      },
      (error) => {
        console.error('Error fetching company logo:', error);
        this.logoUrl = 'assets/hiring.png';
      }
    );
  }



  
}
