import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UiService } from '../../services/gym.service';

@Component({
  selector: 'app-admin-access',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './admin-access.html',
  styleUrl: './admin-access.css'
})
export class AdminAccessComponent {
  readonly ui = inject(UiService);
  pass  = '';
  err   = signal('');
  shake = signal(false);

  verify() {
    if (this.pass === 'Password') {
      this.ui.showAdmin.set(false);
      this.ui.showAdminP.set(true);
      this.pass = '';
    } else {
      this.err.set('Contraseña incorrecta');
      this.shake.set(false);
      setTimeout(() => this.shake.set(true), 10);
      setTimeout(() => this.shake.set(false), 450);
    }
  }

  onOverlay(e: MouseEvent) {
    if ((e.target as HTMLElement).classList.contains('modal-overlay')) this.ui.showAdmin.set(false);
  }
}
