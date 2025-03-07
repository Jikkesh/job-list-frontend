import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-detail-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detail-item.component.html',
  styleUrl: './detail-item.component.css'
})
export class DetailItemComponent {
  @Input() icon: string | null = '';
  @Input() text: string | null = '';
}
