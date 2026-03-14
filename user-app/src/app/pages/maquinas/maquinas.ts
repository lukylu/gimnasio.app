import { Component, signal } from '@angular/core';
import { MACHINES, ZONE_COLOR, ZONE_META, Machine } from '../../services/gym.service';

type Zone = 'todos' | 'cardio' | 'fuerza' | 'maquinas' | 'funcional';

@Component({
  selector: 'app-maquinas',
  standalone: true,
  templateUrl: './maquinas.html',
  styleUrl: './maquinas.css'
})
export class MaquinasComponent {
  readonly activeZone = signal<Zone>('todos');

  readonly tabs: { key: Zone; label: string; count: number }[] = [
    { key:'todos',     label:'Todas',    count: 0 },
    { key:'cardio',    label:'Cardio',   count: MACHINES['cardio'].length },
    { key:'fuerza',    label:'Fuerza',   count: MACHINES['fuerza'].length },
    { key:'maquinas',  label:'Máquinas', count: MACHINES['maquinas'].length },
    { key:'funcional', label:'Funcional',count: MACHINES['funcional'].length },
  ];

  machines(): Machine[] {
    const z = this.activeZone();
    return z === 'todos' ? Object.values(MACHINES).flat() : (MACHINES[z] ?? []);
  }

  meta()          { return ZONE_META[this.activeZone()]; }
  zoneColor(z: string) { return ZONE_COLOR[z] ?? '#e8ff3e'; }
}
