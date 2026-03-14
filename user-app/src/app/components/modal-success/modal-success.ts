import { Component, inject } from '@angular/core';
import { UiService } from '../../services/gym.service';

@Component({
  selector: 'app-modal-success',
  standalone: true,
  templateUrl: './modal-success.html',
  styleUrl: './modal-success.css'
})
export class ModalSuccessComponent {
  readonly ui = inject(UiService);

  r()       { return this.ui.receipt(); }
  suffix()  { return this.r()?.ctx.type === 'plan' ? '/mes' : ''; }
  subtitle(){ const t = this.r()?.ctx.type; return t === 'plan' ? `Membresía ${this.r()?.ctx.name} activada` : `${this.r()?.ctx.name} reservada correctamente`; }
  lines()   { return (this.r()?.ctx.detail ?? '').split('\n'); }

  onOverlay(e: MouseEvent) {
    if ((e.target as HTMLElement).classList.contains('modal-overlay')) this.ui.showSuccess.set(false);
  }
}
