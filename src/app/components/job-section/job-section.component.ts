import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SkeletonCardComponent } from '../skeleton-card/skeleton-card.component';

@Component({
  selector: 'app-job-section',
  standalone: true,
  imports: [CommonModule, RouterModule, SkeletonCardComponent],
  templateUrl: './job-section.component.html',
  styleUrl: './job-section.component.css'
})
export class JobSectionComponent implements OnInit{
  @Input() title!: string;
  @Input() to!: string;
  @Input() jobs: any[] = [];
  public noList: boolean = true
  public skeletonCount: number = 2

  constructor(){}

  ngOnInit(): void {
    if(this.jobs){
      this.noList == false
    }
  }

}
