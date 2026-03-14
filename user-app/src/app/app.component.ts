import { Component, inject, HostListener, AfterViewInit } from '@angular/core';
import { NavbarComponent }       from './components/navbar/navbar';
import { FooterComponent }       from './components/footer/footer';
import { ToastComponent }        from './components/toast/toast';
import { ModalAuthComponent }    from './components/modal-auth/modal-auth';
import { ModalPaymentComponent } from './components/modal-payment/modal-payment';
import { ModalSuccessComponent } from './components/modal-success/modal-success';
import { AdminAccessComponent }  from './components/admin-access/admin-access';
import { AdminPanelComponent }   from './components/admin-panel/admin-panel';
import { HomeComponent }         from './pages/home/home';
import { ClasesComponent }       from './pages/clases/clases';
import { PadelComponent }        from './pages/padel/padel';
import { MaquinasComponent }     from './pages/maquinas/maquinas';
import { PreciosComponent }      from './pages/precios/precios';
import { UserPanelComponent }    from './pages/user-panel/user-panel';
import { UiService, AuthService, OrdersService } from './services/gym.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NavbarComponent, FooterComponent, ToastComponent,
    ModalAuthComponent, ModalPaymentComponent, ModalSuccessComponent,
    AdminAccessComponent, AdminPanelComponent,
    HomeComponent, ClasesComponent, PadelComponent,
    MaquinasComponent, PreciosComponent, UserPanelComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit {
  readonly ui     = inject(UiService);
  readonly auth   = inject(AuthService);
  readonly orders = inject(OrdersService);

  async ngAfterViewInit() {
    this.orders.init();
    await this.auth.init();
    this.initReveal();
  }

  @HostListener('document:keydown.escape')
  onEscape() { this.ui.closeAll(); }

  private initReveal() {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.reveal, .reveal-left, .reveal-scale, .stagger').forEach(el => observer.observe(el));
  }
}
