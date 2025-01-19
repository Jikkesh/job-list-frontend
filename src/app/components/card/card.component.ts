import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {
  @Input() id!: string;
  @Input() title!: string;
  @Input() company!: string;
  @Input() companyLogo!: string;
  @Input() location!: string;
  @Input() salary!: string;
  @Input() type!: string;
  @Input() postedDate!: string;
  @Input() description!: string;

  // @Input() jobs: any = [];

  // public job_array = this.jobs
  

}
