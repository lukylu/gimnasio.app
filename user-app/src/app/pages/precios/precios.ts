import { Component, inject } from '@angular/core';
import { AuthService, UiService, OrdersService, PLANS, Plan } from '../../services/gym.service';

@Component({
  selector: 'app-precios',
  standalone: true,
  templateUrl: './precios.html',
  styleUrl: './precios.css'
})
export class PreciosComponent {
  readonly auth   = inject(AuthService);
  readonly ui     = inject(UiService);
  readonly orders = inject(OrdersService);

  readonly plans = PLANS;

  membership()  { return this.orders.membership(this.auth.currentUser()?.email ?? ''); }
  activeName()  { return this.membership()?.name.replace('Plan ', '') ?? null; }
  firstName()   { return this.auth.currentUser()?.name.split(' ')[0] ?? ''; }
  isActive(p: Plan) { return this.activeName() === p.name; }

  planIdx(name: string) { return PLANS.findIndex(p => p.name === name); }

  btnLabel(p: Plan): string {
    if (this.isActive(p)) return '✓ Plan actual';
    if (this.activeName()) {
      return this.planIdx(p.name) > this.planIdx(this.activeName()!) ? `⬆ Mejorar a ${p.name}` : `Cambiar a ${p.name}`;
    }
    return `Elegir ${p.name} →`;
  }

  btnStyle(p: Plan): string {
    if (this.isActive(p)) return 'background:rgba(232,255,62,0.1);border:1px solid var(--accent);color:var(--accent);cursor:default';
    if (this.activeName() && this.planIdx(p.name) < this.planIdx(this.activeName()!)) return 'border-color:var(--muted);color:var(--muted)';
    return '';
  }

  select(p: Plan) {
    if (this.isActive(p)) return;
    if (!this.auth.currentUser()) { this.ui.openAuth('register'); return; }
    this.ui.openPay({
      type:'plan', id: p.name,
      name: `Plan ${p.name}`, emoji: '💳', price: Number(p.price),
      detail: `💳 Membresía ${p.name}\n📅 Facturación mensual\n✓ ${p.features.filter(f=>f.active).length} beneficios incluidos`
    });
  }

  cancelMembership() {
    const m = this.membership();
    if (!m) return;
    if (!confirm(`¿Cancelar membresía ${this.activeName()}?`)) return;
    this.orders.cancel(m.id);
    this.ui.showToast('Membresía cancelada');
  }
}
