import { Component, inject, signal } from '@angular/core';
import { AuthService, UiService, User } from '../../services/gym.service';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  templateUrl: './admin-panel.html',
  styleUrl: './admin-panel.css'
})
export class AdminPanelComponent {
  readonly auth = inject(AuthService);
  readonly ui   = inject(UiService);

  deletingId  = signal<number|null>(null);
  jsonVisible = signal(false);

  users()     { return this.auth.all(); }
  idShort(id: number) { return String(id).slice(-6); }
  todayCount() { const t = new Date().toLocaleDateString('es-ES'); return this.users().filter(u => u.registeredAt?.startsWith(t)).length; }
  lastUser()   { const u = this.users(); return u.length ? u[u.length-1].name.split(' ')[0] : '—'; }
  jsonOut()    { return JSON.stringify(this.users().map(u => ({ id:u.id, nombre:u.name, email:u.email, passwordHash_SHA256:u.passwordHash, registradoEn:u.registeredAt })), null, 2); }
  esc(s: string) { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  async deleteUser(user: User) {
    if (!confirm(`¿Eliminar permanentemente a ${user.name} (${user.email})?\n\nEsta acción no se puede deshacer.`)) return;
    this.deletingId.set(user.id);
    await new Promise(r => setTimeout(r, 320));
    await this.auth.delete(user.id);
    this.deletingId.set(null);
    this.ui.showToast(`✓ Usuario ${user.name} eliminado`);
  }

  onOverlay(e: MouseEvent) {
    if ((e.target as HTMLElement).classList.contains('modal-overlay')) this.ui.showAdminP.set(false);
  }
}
