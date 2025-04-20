import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

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
  jobImages: string | null = null;

  constructor() { }
  ngOnInit(): void {
    this.jobImages = this.companyLogo
  }
}
