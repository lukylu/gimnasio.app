import { Injectable, signal } from '@angular/core';

/* ─── Types ─────────────────────────────────────────────────── */
export interface GymClass {
  id: number; name: string; emoji: string; instructor: string;
  time: string; duration: string; level: string;
  spots: number; maxSpots: number; desc: string;
}
export interface Court {
  id: number; name: string; type: string; indoor: boolean;
  occupiedByDay: Record<number, string[]>;
}
export interface Machine {
  icon: string; name: string; zone: string; desc: string; tags: string[];
}
export interface Plan {
  name: string; target: string; price: string; period: string;
  featured: boolean; badge?: string;
  features: { text: string; active: boolean }[];
}
export interface Order {
  id: number; txId: string; userEmail: string;
  type: 'class' | 'padel' | 'plan';
  name: string; emoji: string; price: number; detail: string;
  cardLast4: string; date: string; status: 'active' | 'cancelled';
  courtId?: number; slot?: string; dateKey?: string;
}
export interface User {
  id: number; name: string; email: string;
  passwordHash: string; registeredAt: string;
}
export interface PayCtx {
  type: 'class' | 'padel' | 'plan'; id: number | string;
  name: string; emoji: string; price: number; detail: string;
  courtId?: number; slot?: string; dateKey?: string;
}

/* ─── Static data ─────────────────────────────────────────── */
export const CLASSES: GymClass[] = [
  { id:1, name:'Spinning',     emoji:'🚴', instructor:'Carlos M.', time:'Lun/Mié/Vie — 7:00',   duration:'45 min', level:'Todos',        spots:8,  maxSpots:20, desc:'Entrena tu resistencia cardiovascular al ritmo de música energética con bicicletas de alta gama.' },
  { id:2, name:'CrossFit',     emoji:'🏋️', instructor:'Laura P.',  time:'Mar/Jue — 19:00',       duration:'60 min', level:'Intermedio',   spots:4,  maxSpots:16, desc:'Entrenamiento funcional de alta intensidad que combina fuerza, resistencia y potencia.' },
  { id:3, name:'Yoga Flow',    emoji:'🧘', instructor:'Ana R.',    time:'Lun/Mié — 10:00',       duration:'60 min', level:'Todos',        spots:12, maxSpots:20, desc:'Secuencias fluidas que mejoran la flexibilidad, el equilibrio y la conciencia corporal.' },
  { id:4, name:'HIIT Express', emoji:'🔥', instructor:'David S.',  time:'Mar/Jue/Sáb — 8:00',    duration:'30 min', level:'Avanzado',     spots:2,  maxSpots:15, desc:'Intervalos de alta intensidad para quemar grasa y mejorar el rendimiento en poco tiempo.' },
  { id:5, name:'Body Pump',    emoji:'💪', instructor:'Sara L.',   time:'Lun/Mié/Vie — 17:30',   duration:'55 min', level:'Todos',        spots:10, maxSpots:25, desc:'Trabajo muscular completo con barras y discos al ritmo de la música. Define y tonifica.' },
  { id:6, name:'Pilates',      emoji:'🌿', instructor:'Elena V.',  time:'Mar/Jue — 11:00',       duration:'50 min', level:'Principiante', spots:9,  maxSpots:14, desc:'Fortalecimiento del núcleo y corrección postural mediante movimientos controlados y precisos.' },
];

export const COURTS: Court[] = [
  { id:1, name:'Pista Alfa',  type:'Cubierta · Cristal',  indoor:true,  occupiedByDay:{ 0:['09:00','10:00','15:00','16:00','20:00'],1:['08:00','09:00','11:00','15:00','19:00','20:00'],2:['10:00','11:00','17:00','18:00'],3:['09:00','10:00','13:00','14:00','19:00','20:00','21:00'],4:['08:00','09:00','10:00','16:00','17:00','20:00'],5:['09:00','10:00','11:00','12:00','15:00','16:00','17:00','18:00'],6:['10:00','11:00','12:00','16:00','17:00','20:00','21:00'] }},
  { id:2, name:'Pista Beta',  type:'Cubierta · Cristal',  indoor:true,  occupiedByDay:{ 0:['10:00','11:00','12:00','18:00','19:00'],1:['09:00','10:00','12:00','13:00','17:00','18:00','21:00'],2:['08:00','09:00','14:00','15:00','19:00','20:00'],3:['10:00','11:00','16:00','17:00','18:00'],4:['09:00','10:00','11:00','15:00','16:00','19:00','20:00','21:00'],5:['08:00','09:00','10:00','11:00','12:00','13:00','17:00','18:00','19:00'],6:['09:00','10:00','11:00','12:00','15:00','16:00','20:00','21:00'] }},
  { id:3, name:'Pista Gamma', type:'Exterior · Moqueta',  indoor:false, occupiedByDay:{ 0:['10:00','11:00','16:00'],1:['09:00','10:00','11:00','16:00','17:00'],2:['12:00','13:00','18:00','19:00'],3:['10:00','11:00','15:00','16:00'],4:['09:00','10:00','17:00','18:00','19:00'],5:['10:00','11:00','12:00','13:00','16:00','17:00','18:00','19:00','20:00'],6:['09:00','10:00','11:00','12:00','16:00','17:00','18:00'] }},
  { id:4, name:'Pista Delta', type:'Exterior · Moqueta',  indoor:false, occupiedByDay:{ 0:['11:00','12:00','17:00','18:00'],1:['08:00','14:00','15:00','20:00','21:00'],2:['09:00','10:00','16:00','17:00'],3:['11:00','12:00','13:00','18:00','19:00'],4:['10:00','11:00','15:00','16:00','20:00','21:00'],5:['09:00','10:00','11:00','12:00','15:00','16:00','17:00','18:00','19:00','20:00'],6:['10:00','11:00','14:00','15:00','16:00','17:00'] }},
];

export const MACHINES: Record<string, Machine[]> = {
  cardio:[
    { icon:'🏃', name:'Cinta de correr Life Fitness', zone:'cardio',    desc:'Pantalla táctil 15", velocidad hasta 22 km/h, simulación de terrenos y conexión a apps.', tags:['Cardio','Resistencia','Quema grasa'] },
    { icon:'🚴', name:'Bici elíptica Technogym',       zone:'cardio',    desc:'Movimiento de bajo impacto articular. 25 niveles de resistencia magnética.',              tags:['Cardio','Bajo impacto'] },
    { icon:'🚣', name:'Remo Concept2 Model D',         zone:'cardio',    desc:'Estándar competitivo. Monitor PM5 con métricas avanzadas. Resistencia por aire.',         tags:['Full body','Cardio','Fuerza'] },
    { icon:'🧗', name:'Escaladora StepMill 10G',       zone:'cardio',    desc:'Escalones reales para máxima activación de glúteos y piernas.',                           tags:['Glúteos','Piernas','Cardio'] },
    { icon:'🎿', name:'Ski Erg Concept2',              zone:'cardio',    desc:'Simulador de esquí nórdico. Zona media y hombros con cardio.',                            tags:['Full body','Core','Cardio'] },
  ],
  fuerza:[
    { icon:'🏋️', name:'Jaula de sentadillas Rogue',   zone:'fuerza',    desc:'Jaula multipower premium con barra olímpica. Sentadillas, press y dominadas.',            tags:['Piernas','Espalda','Pecho'] },
    { icon:'💪', name:'Zona de peso libre completa',   zone:'fuerza',    desc:'Mancuernas de 2 a 60 kg, barras olímpicas, discos bumper plates. 120m².',               tags:['Fuerza','Volumen','Definición'] },
    { icon:'🛋️', name:'Banco de press plano/inclinado',zone:'fuerza',    desc:'Bancos ajustables profesionales con soportes de seguridad.',                             tags:['Pecho','Tríceps','Hombros'] },
    { icon:'🤸', name:'Barra de dominadas multiagarre',zone:'fuerza',    desc:'Agarre neutro, supino y prono. Hasta 200 kg. Sistema de asistencia.',                    tags:['Espalda','Bíceps','Core'] },
  ],
  maquinas:[
    { icon:'🦵', name:'Prensa de piernas 45°',        zone:'maquinas',  desc:'Guía inclinada para cuádriceps, glúteos e isquiotibiales. Carga máx. 400 kg.',           tags:['Cuádriceps','Glúteos','Isquios'] },
    { icon:'🎯', name:'Polea alta y baja cable',       zone:'maquinas',  desc:'Sistema de poleas dual con selector de peso. Espalda y aislamiento.',                   tags:['Espalda','Hombros','Bíceps'] },
    { icon:'🦿', name:'Extensora de cuádriceps',       zone:'maquinas',  desc:'Extensión de pierna con ajuste fino de eje. Ideal para rehabilitación.',                 tags:['Cuádriceps','Rehabilitación'] },
    { icon:'🛌', name:'Curl femoral tumbado',          zone:'maquinas',  desc:'Máquina específica para isquiotibiales. Rango completo con resistencia constante.',      tags:['Isquiotibiales','Glúteos'] },
    { icon:'🏔️', name:'Press de hombros guiado',      zone:'maquinas',  desc:'Movimiento controlado para deltoides. Agarre en ángulo neutro.',                        tags:['Hombros','Tríceps'] },
    { icon:'🦋', name:'Pec Deck (mariposa)',           zone:'maquinas',  desc:'Aislamiento de pectoral con brazo de palanca regulable.',                               tags:['Pecho','Hombros posteriores'] },
  ],
  funcional:[
    { icon:'⚡', name:'Rack de kettlebells',           zone:'funcional', desc:'Set completo de 4 a 48 kg. Zona dedicada con suelo de caucho y espejo.',                 tags:['Funcional','Core','Potencia'] },
    { icon:'🤼', name:'TRX y suspensión',              zone:'funcional', desc:'Entrenamiento en suspensión. 12 estaciones simultáneas.',                               tags:['Funcional','Core','Equilibrio'] },
    { icon:'🥊', name:'Saco de boxeo',                 zone:'funcional', desc:'Sacos de 40 kg colgantes y de pared. Suelo técnico antiimpacto.',                       tags:['Cardio','Coordinación','Potencia'] },
    { icon:'💥', name:'Battle Ropes',                  zone:'funcional', desc:'Cuerdas de batalla de 15 m. Potencia cardiovascular y fuerza explosiva.',               tags:['Potencia','Cardio','Fuerza'] },
  ],
};

export const PLANS: Plan[] = [
  { name:'Basic',  target:'Solo cardio',        price:'29', period:'/ mes', featured:false,
    features:[{text:'Acceso zona cardio',active:true},{text:'Vestuarios + duchas',active:true},{text:'Horario 7:00–22:00',active:true},{text:'App de reservas',active:true},{text:'Clases dirigidas',active:false},{text:'Zona de pesas libre',active:false},{text:'Pistas de pádel (-10%)',active:false},{text:'Evaluación física',active:false}] },
  { name:'Elite',  target:'Lo más popular',     price:'49', period:'/ mes', featured:true, badge:'⭐ Popular',
    features:[{text:'Acceso completo al gym',active:true},{text:'Vestuarios + duchas',active:true},{text:'Horario 24/7',active:true},{text:'App de reservas',active:true},{text:'8 clases dirigidas / mes',active:true},{text:'Zona de pesas libre',active:true},{text:'Pistas de pádel (-10%)',active:true},{text:'Evaluación física mensual',active:false}] },
  { name:'Pro',    target:'Máximo rendimiento', price:'79', period:'/ mes', featured:false,
    features:[{text:'Acceso completo al gym',active:true},{text:'Vestuarios + sauna',active:true},{text:'Horario 24/7',active:true},{text:'App de reservas',active:true},{text:'Clases ilimitadas',active:true},{text:'Zona de pesas libre',active:true},{text:'Pistas de pádel gratis (4h/mes)',active:true},{text:'Evaluación física mensual',active:true}] },
];

export const PADEL_HOURS = ['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00'];

export const CLASS_COLORS: Record<number, { color:string; alpha:string; alpha2:string; border:string }> = {
  1:{ color:'#e8ff3e', alpha:'rgba(232,255,62,0.07)',  alpha2:'rgba(232,255,62,0.14)',  border:'rgba(232,255,62,0.22)'  },
  2:{ color:'#ff6b35', alpha:'rgba(255,107,53,0.07)',  alpha2:'rgba(255,107,53,0.14)',  border:'rgba(255,107,53,0.25)'  },
  3:{ color:'#7ee8fa', alpha:'rgba(126,232,250,0.07)', alpha2:'rgba(126,232,250,0.14)', border:'rgba(126,232,250,0.22)' },
  4:{ color:'#ff4d4d', alpha:'rgba(255,77,77,0.07)',   alpha2:'rgba(255,77,77,0.14)',   border:'rgba(255,77,77,0.25)'   },
  5:{ color:'#b97fff', alpha:'rgba(185,127,255,0.07)', alpha2:'rgba(185,127,255,0.14)', border:'rgba(185,127,255,0.25)' },
  6:{ color:'#4dff91', alpha:'rgba(77,255,145,0.07)',  alpha2:'rgba(77,255,145,0.14)',  border:'rgba(77,255,145,0.22)'  },
};

export const ZONE_COLOR: Record<string,string> = { cardio:'#ff6b35', fuerza:'#e8ff3e', maquinas:'#7ee8fa', funcional:'#ff4d4d' };

export const ZONE_META: Record<string,{ icon:string; label:string; color:string; desc:string; stats:{n:string;l:string}[] }> = {
  todos:    { icon:'⚡', label:'Todas las Zonas',  color:'#e8ff3e', desc:'Acceso completo a más de 19 equipos de alta gama distribuidos en 4 zonas especializadas.',    stats:[{n:'19+',l:'Equipos'},{n:'4',l:'Zonas'},{n:'600m²',l:'Superficie'}] },
  cardio:   { icon:'🏃', label:'Zona Cardio',       color:'#ff6b35', desc:'Máquinas cardiovasculares de última generación con conectividad a apps y pantallas táctiles.',stats:[{n:'5',l:'Máquinas'},{n:'22km/h',l:'Vel. máx.'},{n:'25',l:'Niveles res.'}] },
  fuerza:   { icon:'🏋️', label:'Fuerza Libre',      color:'#e8ff3e', desc:'120m² de zona olímpica con mancuernas hasta 60 kg, barras olímpicas y jaulas Rogue.',        stats:[{n:'4',l:'Estaciones'},{n:'60kg',l:'Mancuernas'},{n:'120m²',l:'Zona'}] },
  maquinas: { icon:'🎯', label:'Máquinas Guiadas',   color:'#7ee8fa', desc:'Equipos de guía mecánica para aislamiento muscular, rehabilitación y progresión segura.',    stats:[{n:'6',l:'Máquinas'},{n:'400kg',l:'Carga máx.'},{n:'∞',l:'Ajustes'}] },
  funcional:{ icon:'🔥', label:'Zona Funcional',    color:'#ff4d4d', desc:'Espacio dinámico con kettlebells, TRX, battle ropes y saco de boxeo.',                       stats:[{n:'4',l:'Equipos'},{n:'48kg',l:'Kettlebell'},{n:'15m',l:'Battle rope'}] },
};

/* ─── Auth service ────────────────────────────────────────── */
const DB_KEY = 'ironcore_users';
const IDB_NAME = 'IroncoreGymDB', IDB_STORE = 'users', IDB_VERSION = 1;

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly currentUser = signal<{ name: string; email: string } | null>(null);

  private memDB: User[] = [];

  async init(): Promise<void> {
    try { const r = localStorage.getItem(DB_KEY); if (r) this.memDB = JSON.parse(r); } catch {}
    try {
      const idb = await this.idbAll();
      if (idb.length >= this.memDB.length) this.memDB = idb;
      await this.idbSave(this.memDB);
      this.lsSave(this.memDB);
    } catch {}
  }

  all()            { return [...this.memDB]; }
  find(email: string) { return this.memDB.find(u => u.email.toLowerCase() === email.toLowerCase()); }

  async add(user: User): Promise<void> {
    this.memDB.push(user); this.lsSave(this.memDB);
    try { await this.idbSave(this.memDB); } catch {}
  }

  async delete(id: number): Promise<void> {
    const u = this.memDB.find(x => x.id === id);
    this.memDB = this.memDB.filter(x => x.id !== id);
    this.lsSave(this.memDB);
    try { await this.idbSave(this.memDB); } catch {}
    if (u && this.currentUser()?.email === u.email) this.logout();
  }

  login(user: { name: string; email: string }) { this.currentUser.set(user); }
  logout() { this.currentUser.set(null); }

  async sha256(text: string): Promise<string> {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('');
  }

  private lsSave(u: User[]) { try { localStorage.setItem(DB_KEY, JSON.stringify(u)); } catch {} }

  private idbOpen(): Promise<IDBDatabase> {
    return new Promise((res, rej) => {
      const req = indexedDB.open(IDB_NAME, IDB_VERSION);
      req.onupgradeneeded = e => {
        const db = (e.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(IDB_STORE)) db.createObjectStore(IDB_STORE, { keyPath:'id' });
      };
      req.onsuccess = e => res((e.target as IDBOpenDBRequest).result);
      req.onerror   = () => rej(req.error);
    });
  }
  private async idbAll(): Promise<User[]> {
    const db = await this.idbOpen();
    return new Promise((res, rej) => {
      const req = db.transaction(IDB_STORE,'readonly').objectStore(IDB_STORE).getAll();
      req.onsuccess = () => res(req.result ?? []);
      req.onerror   = () => rej(req.error);
    });
  }
  private async idbSave(users: User[]): Promise<void> {
    const db = await this.idbOpen();
    return new Promise((res, rej) => {
      const tx = db.transaction(IDB_STORE,'readwrite');
      const st = tx.objectStore(IDB_STORE);
      st.clear(); users.forEach(u => st.put(u));
      tx.oncomplete = () => res(); tx.onerror = () => rej(tx.error);
    });
  }
}

/* ─── Orders service ─────────────────────────────────────── */
const ORDERS_KEY = 'ironcore_orders';

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private _orders = signal<Order[]>([]);
  readonly orders = this._orders.asReadonly();

  init() {
    try { this._orders.set(JSON.parse(localStorage.getItem(ORDERS_KEY) ?? '[]')); } catch { this._orders.set([]); }
  }

  forUser(email: string) { return this._orders().filter(o => o.userEmail === email && o.status !== 'cancelled'); }
  membership(email: string) { return this._orders().find(o => o.userEmail === email && o.type === 'plan' && o.status !== 'cancelled'); }

  add(order: Order) { this._orders.update(os => [...os, order]); this.save(); }
  cancel(id: number) { this._orders.update(os => os.map(o => o.id === id ? { ...o, status: 'cancelled' as const } : o)); this.save(); }

  isOccupied(courtId: number, hour: string, dateKey: string, byDay: Record<number,string[]>): boolean {
    const dow = new Date(dateKey + 'T12:00:00').getDay();
    const base = (byDay[dow] ?? []).includes(hour);
    const reserved = this._orders().some(o => o.status !== 'cancelled' && o.type === 'padel' && o.courtId === courtId && o.slot === hour && o.dateKey === dateKey);
    return base || reserved;
  }

  isMine(email: string, courtId: number, hour: string, dateKey: string): boolean {
    return this._orders().some(o => o.status !== 'cancelled' && o.type === 'padel' && o.courtId === courtId && o.slot === hour && o.dateKey === dateKey && o.userEmail === email);
  }

  txId() { return 'TX' + Math.random().toString(36).substr(2,8).toUpperCase(); }

  private save() { try { localStorage.setItem(ORDERS_KEY, JSON.stringify(this._orders())); } catch {} }
}

/* ─── UI service ─────────────────────────────────────────── */
@Injectable({ providedIn: 'root' })
export class UiService {
  readonly showAuth    = signal(false);
  readonly showPay     = signal(false);
  readonly showSuccess = signal(false);
  readonly showPanel   = signal(false);
  readonly showAdmin   = signal(false);
  readonly showAdminP  = signal(false);
  readonly authTab     = signal<'login'|'register'>('login');
  readonly toast       = signal('');
  readonly payCtx      = signal<PayCtx | null>(null);
  readonly receipt     = signal<{ ctx: PayCtx; txId: string; last4: string; date: string } | null>(null);
  readonly toastVisible = signal(false);

  private toastTimer: ReturnType<typeof setTimeout> | null = null;

  openAuth(tab: 'login'|'register' = 'login') { this.authTab.set(tab); this.showAuth.set(true); }
  closeAll() { this.showAuth.set(false); this.showPay.set(false); this.showSuccess.set(false); this.showPanel.set(false); this.showAdmin.set(false); this.showAdminP.set(false); }
  openPay(ctx: PayCtx) { this.payCtx.set(ctx); this.showPay.set(true); }

  showToast(msg: string) {
    this.toast.set(msg);
    this.toastVisible.set(true);
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => this.toastVisible.set(false), 3500);
  }
}
