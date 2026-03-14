import { Component, inject, signal, HostListener } from '@angular/core';
import { AuthService, UiService } from '../../services/gym.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent {
  readonly auth = inject(AuthService);
  readonly ui   = inject(UiService);
  readonly scrolled   = signal(false);
  readonly drawerOpen = signal(false);

  initials() {
    const u = this.auth.currentUser();
    return u ? u.name.split(' ').map((n:string) => n[0]).join('').slice(0,2).toUpperCase() : '';
  }
  firstName() { return this.auth.currentUser()?.name.split(' ')[0] ?? ''; }

  scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior:'smooth' });
    this.drawerOpen.set(false);
  }

  @HostListener('window:scroll')
  onScroll() { this.scrolled.set(window.scrollY > 40); }
}
