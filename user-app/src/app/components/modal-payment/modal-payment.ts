import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService, OrdersService, UiService } from '../../services/gym.service';

@Component({
  selector: 'app-modal-payment',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './modal-payment.html',
  styleUrl: './modal-payment.css'
})
export class ModalPaymentComponent {
  readonly auth   = inject(AuthService);
  readonly orders = inject(OrdersService);
  readonly ui     = inject(UiService);

  step = signal<1|2|3>(1);
  err1 = signal(''); err2 = signal('');
  cardIcon  = signal('💳');
  procIcon  = signal('⏳');
  procTitle = signal('Procesando pago...');
  procText  = signal('Por favor espera');
  progress  = signal('0%');

  payName = ''; payLastname = ''; payEmail = ''; payPhone = '';
  cardNumber = ''; cardExpiry = ''; cardCvv = ''; cardHolder = '';

  constructor() {
    const u = this.auth.currentUser();
    if (u) { this.payName = u.name.split(' ')[0]; this.payLastname = u.name.split(' ').slice(1).join(' '); this.payEmail = u.email; }
  }

  ctx() { return this.ui.payCtx(); }
  suffix() { return this.ctx()?.type === 'plan' ? '/mes' : ''; }

  onOverlay(e: MouseEvent) {
    if ((e.target as HTMLElement).classList.contains('modal-overlay')) this.ui.showPay.set(false);
  }

  goStep2() {
    if (!this.payName || !this.payLastname || !this.payEmail || !this.payPhone) { this.err1.set('Rellena todos los campos'); return; }
    this.err1.set(''); this.step.set(2);
  }

  onCard(val: string) {
    if (/[a-zA-Z]/.test(val)) { this.cardIcon.set(val.toLowerCase().includes('gold') ? '🥇' : '💳'); return; }
    const d = val.replace(/\D/g,'').slice(0,16);
    this.cardNumber = d.replace(/(.{4})/g,'$1 ').trim();
    this.cardIcon.set(d.startsWith('4') ? '💙' : d.startsWith('5') ? '🔴' : d.startsWith('3') ? '🟢' : '💳');
  }

  onExpiry(val: string) {
    const d = val.replace(/\D/g,'').slice(0,4);
    this.cardExpiry = d.length >= 2 ? d.slice(0,2) + '/' + d.slice(2) : d;
  }

  pay() {
    const gold = this.cardNumber.toLowerCase() === 'gold credit card';
    const real = /^\d{4}\s\d{4}\s\d{4}\s\d{4}$/.test(this.cardNumber);
    if ((!gold && !real) || !this.cardExpiry || !this.cardCvv || !this.cardHolder) { this.err2.set('Verifica los datos de tu tarjeta'); return; }
    this.err2.set(''); this.step.set(3);
    setTimeout(() => this.progress.set('100%'), 50);
    setTimeout(() => { this.procIcon.set('🔒'); this.procTitle.set('Verificando seguridad...'); this.procText.set('Comprobando datos con el banco'); }, 900);
    setTimeout(() => { this.procIcon.set('✅'); this.procTitle.set('¡Pago aceptado!'); this.procText.set('Generando confirmación...'); }, 2000);
    setTimeout(() => this.finish(), 2800);
  }

  private finish() {
    const ctx  = this.ctx()!;
    const user = this.auth.currentUser()!;
    const txId = this.orders.txId();
    const date = new Date().toLocaleString('es-ES');
    const last4 = this.cardNumber.toLowerCase() === 'gold credit card' ? 'GOLD' : this.cardNumber.replace(/\s/g,'').slice(-4);
    this.orders.add({
      id: Date.now(), txId, userEmail: user.email,
      type: ctx.type, name: ctx.name, emoji: ctx.emoji,
      price: ctx.price, detail: ctx.detail,
      cardLast4: last4, date, status: 'active',
      ...(ctx.type === 'padel' ? { courtId: ctx.courtId, slot: ctx.slot, dateKey: ctx.dateKey } : {})
    });
    this.ui.receipt.set({ ctx, txId, last4, date });
    this.ui.showPay.set(false);
    this.ui.showSuccess.set(true);
    this.ui.showToast(`✓ Pago confirmado · ${ctx.price}€ · Ref: ${txId}`);
    this.step.set(1);
  }
}
