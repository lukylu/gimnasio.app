import { Component, inject } from '@angular/core';
import { UiService } from '../../services/gym.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  template: `<div class="toast" [class.show]="ui.toastVisible()">{{ ui.toast() }}</div>`,
  styles: [``]
})
export class ToastComponent {
  readonly ui = inject(UiService);
}
