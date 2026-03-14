import { Component, inject } from '@angular/core';
import { AuthService, UiService, OrdersService, CLASSES, CLASS_COLORS, GymClass } from '../../services/gym.service';

@Component({
  selector: 'app-clases',
  standalone: true,
  templateUrl: './clases.html',
  styleUrl: './clases.css'
})
export class ClasesComponent {
  readonly auth   = inject(AuthService);
  readonly ui     = inject(UiService);
  readonly orders = inject(OrdersService);

  readonly classes = CLASSES;
  readonly colors  = CLASS_COLORS;

  color(id: number)  { return this.colors[id] ?? this.colors[1]; }
  barPct(c: GymClass){ return ((c.maxSpots - c.spots) / c.maxSpots * 100) + '%'; }
  isUrgent(c: GymClass){ return c.spots / c.maxSpots < 0.35; }
  levelStars(level: string) {
    const m: Record<string,string> = { 'Todos':'★☆☆','Principiante':'★☆☆','Intermedio':'★★☆','Avanzado':'★★★' };
    return m[level] ?? '★☆☆';
  }

  reserve(c: GymClass) {
    if (!this.auth.currentUser()) {
      const el = document.getElementById('authPrompt');
      if (el) { el.style.display = 'flex'; el.scrollIntoView({ behavior:'smooth', block:'center' }); }
      setTimeout(() => this.ui.openAuth('login'), 400);
      return;
    }
    this.ui.openPay({
      type: 'class', id: c.id,
      name: c.name, emoji: c.emoji, price: 12,
      detail: `${c.emoji} ${c.name}\n📅 ${c.time}\n👤 ${c.instructor}\n⏱ ${c.duration}`
    });
  }
}
