import { Component, inject, signal } from '@angular/core';
import { AuthService, UiService, OrdersService } from '../../services/gym.service';

@Component({
  selector: 'app-user-panel',
  standalone: true,
  templateUrl: './user-panel.html',
  styleUrl: './user-panel.css'
})
export class UserPanelComponent {
  readonly auth   = inject(AuthService);
  readonly ui     = inject(UiService);
  readonly orders = inject(OrdersService);
  readonly tab    = signal<'classes'|'courts'>('classes');

  user()        { return this.auth.currentUser(); }
  initials()    { return this.user()?.name.split(' ').map((n:string)=>n[0]).join('').slice(0,2).toUpperCase() ?? ''; }
  allOrders()   { return this.orders.forUser(this.user()?.email ?? ''); }
  classOrders() { return this.allOrders().filter(o => o.type === 'class'); }
  courtOrders() { return this.allOrders().filter(o => o.type === 'padel'); }
  membership()  { return this.orders.membership(this.user()?.email ?? ''); }
  totalSpent()  { return this.allOrders().reduce((s, o) => s + o.price, 0); }

  cancel(id: number) {
    if (!confirm('¿Confirmas la cancelación? Esta acción no se puede deshacer.')) return;
    this.orders.cancel(id);
    this.ui.showToast('✓ Reserva cancelada correctamente');
  }

  logout() {
    this.auth.logout();
    this.ui.showPanel.set(false);
    this.ui.showToast('Sesión cerrada correctamente');
  }

  onOverlay(e: MouseEvent) {
    if ((e.target as HTMLElement).classList.contains('modal-overlay')) this.ui.showPanel.set(false);
  }
}
