import { Component, inject, signal, computed } from '@angular/core';
import { AuthService, UiService, OrdersService, COURTS, PADEL_HOURS, Court } from '../../services/gym.service';

export type SlotState = 'free' | 'busy' | 'past' | 'mine';

@Component({
  selector: 'app-padel',
  standalone: true,
  templateUrl: './padel.html',
  styleUrl: './padel.css'
})
export class PadelComponent {
  readonly auth   = inject(AuthService);
  readonly ui     = inject(UiService);
  readonly orders = inject(OrdersService);

  readonly courts = COURTS;
  readonly hours  = PADEL_HOURS;

  readonly selectedDate = signal(new Date());

  dateKey(d = this.selectedDate()) {
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  }

  isToday() { return this.dateKey() === this.dateKey(new Date()); }

  /* 10-day date bar */
  readonly days = computed(() => {
    const today = new Date();
    const days = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
    const months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
    return Array.from({ length: 10 }, (_, i) => {
      const d = new Date(today); d.setDate(today.getDate() + i);
      return { date: d, key: this.dateKey(d), isToday: i === 0, dow: i === 0 ? 'HOY' : days[d.getDay()], num: d.getDate(), mon: months[d.getMonth()] };
    });
  });

  slotState(court: Court, hour: string): SlotState {
    const dk    = this.dateKey();
    const email = this.auth.currentUser()?.email ?? '';
    const now   = new Date();
    if (this.isToday() && now.getHours() >= parseInt(hour)) return 'past';
    if (this.orders.isMine(email, court.id, hour, dk))       return 'mine';
    if (this.orders.isOccupied(court.id, hour, dk, court.occupiedByDay)) return 'busy';
    return 'free';
  }

  freeCount(court: Court) {
    const dk = this.dateKey(); const now = new Date();
    return this.hours.filter(h => {
      if (this.isToday() && now.getHours() >= parseInt(h)) return false;
      return !this.orders.isOccupied(court.id, h, dk, court.occupiedByDay) &&
             !this.orders.isMine(this.auth.currentUser()?.email ?? '', court.id, h, dk);
    }).length;
  }

  myCount(court: Court) {
    const dk = this.dateKey(); const email = this.auth.currentUser()?.email ?? '';
    return this.hours.filter(h => this.orders.isMine(email, court.id, h, dk)).length;
  }

  book(court: Court, hour: string) {
    const state = this.slotState(court, hour);
    if (state !== 'free') return;
    if (!this.auth.currentUser()) {
      const el = document.getElementById('authPrompt');
      if (el) { el.style.display = 'flex'; el.scrollIntoView({ behavior:'smooth', block:'center' }); }
      setTimeout(() => this.ui.openAuth('login'), 400);
      return;
    }
    const dk  = this.dateKey();
    const end = String(parseInt(hour) + 1).padStart(2,'0') + ':00';
    const dateLabel = this.selectedDate().toLocaleDateString('es-ES', { weekday:'long', day:'numeric', month:'long' });
    this.ui.openPay({
      type: 'padel', id: court.id,
      courtId: court.id, slot: hour, dateKey: dk,
      name: court.name, emoji: '🎾', price: 18,
      detail: `🎾 ${court.name}\n📍 ${court.type}\n📅 ${dateLabel}\n⏰ ${hour} – ${end}`
    });
  }
}
