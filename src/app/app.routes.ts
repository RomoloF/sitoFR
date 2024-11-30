import { Routes } from '@angular/router';
import { MapComponent } from './components/map/map.component';
import { HomeComponent } from './components/home/home.component';
import { InfoComponent } from './components/info/info.component';
import { PercorsiComponent } from './components/percorsi/percorsi.component';
import { GeolocalizzazioneComponent } from './components/geolocalizzazione/geolocalizzazione.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'map', component: MapComponent },
  { path: 'percorsi', component: PercorsiComponent },
  { path: 'geolocalizzazione', component: GeolocalizzazioneComponent },
  { path: 'info', component: InfoComponent }
];
