import { Component, Input } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';

@Component({
    selector: 'app-layout',
    imports: [FooterComponent],
    templateUrl: './layout.component.html',
    styleUrl: './layout.component.css'
})
export class LayoutComponent {
  @Input() adSpaceText: string = 'Ad Space';
  
}
