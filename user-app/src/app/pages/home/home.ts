import { Component, inject } from '@angular/core';
import { UiService } from '../../services/gym.service';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent {
  readonly ui = inject(UiService);

  scroll(id: string) { document.getElementById(id)?.scrollIntoView({ behavior:'smooth' }); }
}
