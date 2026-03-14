import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService, UiService } from '../../services/gym.service';

@Component({
  selector: 'app-modal-auth',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './modal-auth.html',
  styleUrl: './modal-auth.css'
})
export class ModalAuthComponent {
  readonly auth = inject(AuthService);
  readonly ui   = inject(UiService);

  loginEmail = ''; loginPass = '';
  regName = ''; regEmail = ''; regPass = '';
  loginErr = signal('');
  regErr   = signal('');

  onOverlay(e: MouseEvent) {
    if ((e.target as HTMLElement).classList.contains('modal-overlay')) this.ui.showAuth.set(false);
  }

  async doLogin() {
    if (!this.loginEmail || this.loginPass.length < 6) { this.loginErr.set('Rellena todos los campos (mín. 6 caracteres)'); return; }
    const hash = await this.auth.sha256(this.loginPass);
    const user = this.auth.find(this.loginEmail);
    if (!user || user.passwordHash !== hash) { this.loginErr.set('Email o contraseña incorrectos'); return; }
    this.auth.login({ name: user.name, email: user.email });
    this.ui.showAuth.set(false);
    this.ui.showToast(`¡Bienvenido/a, ${user.name.split(' ')[0]}! 👋`);
  }

  async doRegister() {
    if (!this.regName || !this.regEmail || this.regPass.length < 6) { this.regErr.set('Rellena todos los campos (mín. 6 caracteres)'); return; }
    if (this.auth.find(this.regEmail)) { this.regErr.set('Este email ya está registrado. Inicia sesión.'); return; }
    const hash = await this.auth.sha256(this.regPass);
    await this.auth.add({ id: Date.now(), name: this.regName, email: this.regEmail, passwordHash: hash, registeredAt: new Date().toLocaleString('es-ES') });
    this.auth.login({ name: this.regName, email: this.regEmail });
    this.ui.showAuth.set(false);
    this.ui.showToast(`¡Bienvenido/a, ${this.regName.split(' ')[0]}! 👋`);
  }
}
