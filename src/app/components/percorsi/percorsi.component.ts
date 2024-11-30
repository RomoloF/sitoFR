import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as L from 'leaflet';

@Component({
  selector: 'app-percorsi',
  templateUrl: './percorsi.component.html',
  styleUrls: ['./percorsi.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class PercorsiComponent implements OnInit {
  startLocation: string = '';
  endLocation: string = '';
  selectedTransport: 'car' | 'walk' | 'bike' = 'car';
  routeInfo: any = null;
  private map!: L.Map;
  private routeLayer?: L.LayerGroup;
  private markersLayer?: L.LayerGroup;
  private startMarker?: L.Marker;
  private endMarker?: L.Marker;
  private startCoords?: [number, number];
  private endCoords?: [number, number];

  ngOnInit() {
    // Inizializza la mappa dopo un breve ritardo per assicurarsi che il container sia pronto
    setTimeout(() => {
      this.initMap();
      // Aggiungi un listener per il ridimensionamento della finestra
      window.addEventListener('resize', () => {
        this.map.invalidateSize();
      });
    }, 100);
  }

  private initMap() {
    // Crea la mappa centrata sull'Italia
    this.map = L.map('map', {
      center: [41.9028, 12.4964],
      zoom: 6,
      zoomControl: true,
      attributionControl: true
    });

    // Aggiungi il layer della mappa
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: ' OpenStreetMap contributors',
      maxZoom: 19,
      minZoom: 3
    }).addTo(this.map);

    // Inizializza i layer per il percorso e i marker
    this.routeLayer = L.layerGroup().addTo(this.map);
    this.markersLayer = L.layerGroup().addTo(this.map);

    // Forza un aggiornamento delle dimensioni della mappa
    setTimeout(() => {
      this.map.invalidateSize();
    }, 200);
  }

  async searchLocation(type: 'start' | 'end') {
    const query = type === 'start' ? this.startLocation : this.endLocation;
    if (!query.trim()) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=it`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const location = data[0];
        const coords: [number, number] = [parseFloat(location.lat), parseFloat(location.lon)];
        
        if (type === 'start') {
          this.startCoords = coords;
          if (this.startMarker) {
            this.markersLayer?.removeLayer(this.startMarker);
          }
          this.startMarker = L.marker(coords, {
            icon: L.divIcon({
              className: 'custom-div-icon',
              html: '<div class="marker-pin start"></div>',
              iconSize: [30, 42],
              iconAnchor: [15, 42]
            })
          }).bindPopup('Partenza').addTo(this.markersLayer!);
        } else {
          this.endCoords = coords;
          if (this.endMarker) {
            this.markersLayer?.removeLayer(this.endMarker);
          }
          this.endMarker = L.marker(coords, {
            icon: L.divIcon({
              className: 'custom-div-icon',
              html: '<div class="marker-pin end"></div>',
              iconSize: [30, 42],
              iconAnchor: [15, 42]
            })
          }).bindPopup('Destinazione').addTo(this.markersLayer!);
        }

        // Centra la mappa sui marker
        if (this.startCoords && this.endCoords) {
          const bounds = L.latLngBounds([this.startCoords, this.endCoords]);
          this.map.fitBounds(bounds, { padding: [50, 50] });
          // Se abbiamo entrambe le coordinate, calcola il percorso
          this.calculateRoute();
        } else {
          this.map.setView(coords, 13);
        }
      }
    } catch (error) {
      console.error('Errore nella ricerca:', error);
      alert('Errore nella ricerca della località. Riprova.');
    }
  }

  clearInput(type: 'start' | 'end') {
    if (type === 'start') {
      this.startLocation = '';
      this.startCoords = undefined;
      if (this.startMarker) {
        this.markersLayer?.removeLayer(this.startMarker);
      }
    } else {
      this.endLocation = '';
      this.endCoords = undefined;
      if (this.endMarker) {
        this.markersLayer?.removeLayer(this.endMarker);
      }
    }
    if (this.routeLayer) {
      this.routeLayer.clearLayers();
    }
    this.routeInfo = null;
  }

  async selectTransport(type: 'car' | 'walk' | 'bike') {
    this.selectedTransport = type;
    console.log('Cambio mezzo di trasporto a:', type);
    if (this.startCoords && this.endCoords) {
      console.log('Ricalcolo percorso con nuovo mezzo');
      await this.calculateRoute();
    }
  }

  canCalculate(): boolean {
    return Boolean(this.startCoords && this.endCoords);
  }

  async calculateRoute() {
    if (!this.startCoords || !this.endCoords) {
      alert('Inserisci prima i punti di partenza e arrivo');
      return;
    }

    const profile = this.getOSRMProfile();
    console.log('Calcolo percorso con profilo:', profile);
    
    try {
      const url = `https://router.project-osrm.org/route/v1/${profile}/${this.startCoords[1]},${this.startCoords[0]};${this.endCoords[1]},${this.endCoords[0]}?overview=full&steps=true&geometries=geojson`;
      console.log('URL richiesta:', url);
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
        console.log('Percorso trovato:', data);
        const route = data.routes[0];
        this.displayRoute(route);
        this.processRouteInfo(route);
      } else {
        console.error('Nessun percorso trovato:', data);
        alert('Impossibile trovare un percorso. Prova con luoghi diversi o un altro mezzo di trasporto.');
      }
    } catch (error) {
      console.error('Errore nel calcolo del percorso:', error);
      alert('Errore nel calcolo del percorso. Riprova più tardi.');
    }
  }

  private getOSRMProfile(): string {
    switch (this.selectedTransport) {
      case 'walk': return 'foot';
      case 'bike': return 'bicycle';
      default: return 'car';
    }
  }

  private displayRoute(route: any) {
    if (!this.routeLayer) return;
    this.routeLayer.clearLayers();

    L.geoJSON(route.geometry, {
      style: {
        color: '#2196F3',
        weight: 5,
        opacity: 0.7
      }
    }).addTo(this.routeLayer);
  }

  private processRouteInfo(route: any) {
    const distance = route.distance;
    let duration = route.duration;

    // Aggiusta la durata in base al mezzo di trasporto
    switch (this.selectedTransport) {
      case 'walk':
        duration = distance / 1.389;
        break;
      case 'bike':
        duration = distance / 4.167;
        break;
      case 'car':
        if (distance < 5000) {
          duration *= 1.3;
        }
        break;
    }

    const steps = route.legs[0].steps;
    const waypoints = route.legs[0].annotation?.nodes || [];

    this.routeInfo = {
      duration: this.formatDuration(duration),
      distance: this.formatDistance(distance),
      avgSpeed: `${((distance / duration) * 3.6).toFixed(1)} km/h`,
      steps: steps.map((step: any) => {
        const instruction = this.getDetailedInstruction(step);
        return {
          instruction: instruction.text,
          icon: instruction.icon,
          distance: this.formatDistance(step.distance),
          streetName: step.name || 'strada senza nome',
          direction: step.maneuver.modifier || 'avanti',
          type: step.maneuver.type
        };
      })
    };
  }

  private getDetailedInstruction(step: any): { text: string, icon: string } {
    const type = step.maneuver.type;
    const modifier = step.maneuver.modifier;
    const streetName = step.name ? `su ${step.name}` : '';
    let text = '';
    let icon = '';

    switch (type) {
      case 'depart':
        text = `Parti da ${this.startLocation}`;
        icon = '🚩';
        break;
      case 'arrive':
        text = `Arrivo a ${this.endLocation}`;
        icon = '🏁';
        break;
      case 'turn':
        text = `Gira ${this.getModifierText(modifier)} ${streetName}`;
        icon = this.getDirectionIcon(modifier);
        break;
      case 'continue':
        text = `Continua dritto ${streetName}`;
        icon = '⬆️';
        break;
      case 'roundabout':
        const exit = step.maneuver.exit || 1;
        text = `Alla rotonda prendi la ${exit}ª uscita ${streetName}`;
        icon = '🔄';
        break;
      case 'merge':
        text = `Immettiti ${this.getModifierText(modifier)} ${streetName}`;
        icon = this.getDirectionIcon(modifier);
        break;
      case 'end of road':
        text = `Fine della strada, gira ${this.getModifierText(modifier)} ${streetName}`;
        icon = this.getDirectionIcon(modifier);
        break;
      case 'fork':
        text = `Al bivio mantieni la ${this.getModifierText(modifier)} ${streetName}`;
        icon = this.getDirectionIcon(modifier);
        break;
      case 'ramp':
        text = `Prendi la rampa ${this.getModifierText(modifier)} ${streetName}`;
        icon = this.getDirectionIcon(modifier);
        break;
      case 'new name':
        text = `Prosegui su ${streetName}`;
        icon = '⬆️';
        break;
      default:
        text = `Prosegui ${streetName}`;
        icon = '⬆️';
    }

    return { text, icon };
  }

  private getDirectionIcon(modifier: string): string {
    switch (modifier) {
      case 'left': return '⬅️';
      case 'right': return '➡️';
      case 'slight left': return '↖️';
      case 'slight right': return '↗️';
      case 'sharp left': return '⬅️';
      case 'sharp right': return '➡️';
      case 'straight': return '⬆️';
      case 'uturn': return '⬇️';
      default: return '⬆️';
    }
  }

  private getModifierText(modifier: string): string {
    switch (modifier) {
      case 'left': return 'a sinistra';
      case 'right': return 'a destra';
      case 'slight left': return 'leggermente a sinistra';
      case 'slight right': return 'leggermente a destra';
      case 'sharp left': return 'bruscamente a sinistra';
      case 'sharp right': return 'bruscamente a destra';
      case 'straight': return 'dritto';
      case 'uturn': return 'con inversione a U';
      default: return '';
    }
  }

  private formatDuration(seconds: number): string {
    if (seconds < 60) {
      return `${Math.round(seconds)} secondi`;
    } else if (seconds < 3600) {
      const minutes = Math.round(seconds / 60);
      return `${minutes} minut${minutes === 1 ? 'o' : 'i'}`;
    } else {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.round((seconds % 3600) / 60);
      return `${hours} or${hours === 1 ? 'a' : 'e'}${minutes > 0 ? ` e ${minutes} minut${minutes === 1 ? 'o' : 'i'}` : ''}`;
    }
  }

  private formatDistance(meters: number): string {
    if (meters < 1000) {
      return `${Math.round(meters)} m`;
    } else {
      const km = meters / 1000;
      return `${km < 10 ? km.toFixed(1) : Math.round(km)} km`;
    }
  }
}
