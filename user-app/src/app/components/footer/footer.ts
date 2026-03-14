import { Component, inject } from '@angular/core';
import { UiService } from '../../services/gym.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class FooterComponent {
  readonly ui = inject(UiService);
}
