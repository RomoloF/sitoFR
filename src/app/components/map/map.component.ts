import { Component, AfterViewInit, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as L from 'leaflet';

interface Location {
  lat: number;
  lon: number;
  display_name: string;
}

interface RouteStep {
  instruction: string;
  distance: number;
  streetName: string;
  maneuverType: string;
  direction: string;
  icon: string;
}

interface OSRMStep {
  distance: number;
  maneuver: {
    instruction: string;
    type: string;
    modifier?: string;
    [key: string]: any;
  };
  name: string;
  ref?: string;
  pronunciation?: string;
  [key: string]: any;
}

interface OSRMLeg {
  steps: OSRMStep[];
  distance: number;
  duration: number;
  [key: string]: any;
}

interface OSRMRoute {
  legs: OSRMLeg[];
  distance: number;
  duration: number;
  geometry: {
    coordinates: [number, number][];
    [key: string]: any;
  };
  [key: string]: any;
}

interface OSRMResponse {
  code: string;
  routes: OSRMRoute[];
  [key: string]: any;
}

interface IconMap {
  [key: string]: string | {
    [key: string]: string;
  };
}

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="map-wrapper">
      <div class="title-container">
        <h1>Mappa Interattiva di Romolo F</h1>
      </div>
      <div class="search-container">
        <div class="search-input">
          <input 
            type="text" 
            [(ngModel)]="startQuery" 
            placeholder="Partenza..."
            (keyup.enter)="searchStart()"
          >
          <button (click)="searchStart()">Cerca</button>
        </div>
        <div class="search-input">
          <input 
            type="text" 
            [(ngModel)]="endQuery" 
            placeholder="Destinazione..."
            (keyup.enter)="searchEnd()"
          >
          <button (click)="searchEnd()">Cerca</button>
        </div>
        <button 
          class="route-button" 
          (click)="calculateRoute()"
          [disabled]="!startQuery || !endQuery"
        >
          Calcola Percorso
        </button>
      </div>
      <div class="content-container">
        <div class="map-container">
          <div class="map-frame">
            <div id="map"></div>
            <button class="locate-button" (click)="locateMe()" title="Trova la mia posizione">
              <i class="fas fa-location-crosshairs"></i>
            </button>
          </div>
        </div>
        <div class="route-info" *ngIf="routeInfo">
          <div class="route-summary">
            <h3>Riepilogo Percorso</h3>
            <p>
              <i class="fas fa-road"></i>
              Distanza totale: {{(routeInfo.distance / 1000).toFixed(1)}} km
            </p>
            <p>
              <i class="fas fa-clock"></i>
              Tempo stimato: {{formatDuration(routeInfo.duration)}}
            </p>
          </div>
          <div class="route-steps">
            <h3>Indicazioni Stradali</h3>
            <div class="steps-container">
              <div class="step" *ngFor="let step of routeSteps">
                <i [class]="step.icon"></i>
                <div class="step-details">
                  <p class="instruction">{{step.instruction}}</p>
                  <p class="distance" *ngIf="step.distance">{{(step.distance / 1000).toFixed(1)}} km</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .map-wrapper {
      display: flex;
      flex-direction: column;
      height: calc(100vh - 60px); /* Sottraiamo l'altezza del footer */
      width: 100%;
      position: relative;
    }

    .title-container {
      text-align: center;
      padding: 15px;
      background-color: #1976d2;
      color: white;
      border-radius: 8px;
      margin-bottom: 15px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .title-container h1 {
      margin: 0;
      font-size: 1.5rem;
      color: white;
    }

    .search-container {
      padding: 15px;
      background-color: #ffffff;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      display: flex;
      gap: 15px;
      flex-wrap: wrap;
      border-radius: 8px;
      margin-bottom: 15px;
    }

    .search-input {
      flex: 1;
      min-width: 200px;
      display: flex;
      gap: 5px;
    }

    .search-input input {
      flex: 1;
      padding: 10px;
      border: 2px solid #e0e0e0;
      border-radius: 6px;
      transition: border-color 0.3s;
    }

    .search-input input:focus {
      outline: none;
      border-color: #1976d2;
    }

    .search-input button,
    .route-button {
      padding: 10px 20px;
      background-color: #1976d2;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    .search-input button:hover,
    .route-button:hover {
      background-color: #1565c0;
    }

    .route-button:disabled {
      background-color: #e0e0e0;
      cursor: not-allowed;
    }

    .content-container {
      flex: 1;
      display: flex;
      gap: 20px;
      padding: 10px;
      overflow: hidden;
    }

    .map-container {
      flex: 2;
      min-width: 0;
    }

    .map-frame {
      height: 100%;
      position: relative;
    }

    #map {
      height: 100%;
      width: 100%;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .locate-button {
      position: absolute;
      bottom: 20px;
      right: 20px;
      padding: 10px;
      background-color: white;
      border: 2px solid rgba(0,0,0,0.2);
      border-radius: 4px;
      cursor: pointer;
      z-index: 1000;
      transition: background-color 0.3s;
    }

    .locate-button:hover {
      background-color: #f5f5f5;
    }

    .locate-button i {
      color: #1976d2;
    }

    .route-info {
      flex: 1;
      min-width: 300px;
      max-width: 400px;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      overflow-y: auto;
      display: flex;
      flex-direction: column;
    }

    .route-summary {
      background-color: #f5f5f5;
      padding: 15px;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
    }

    .route-summary h3 {
      margin: 0 0 10px 0;
      color: #1976d2;
    }

    .route-summary p {
      margin: 5px 0;
      color: #666;
    }

    .route-summary i {
      margin-right: 10px;
      color: #1976d2;
    }

    .route-steps {
      padding: 15px;
      flex: 1;
      overflow-y: auto;
    }

    .route-steps h3 {
      margin: 0 0 10px 0;
      color: #333;
    }

    .steps-container {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .step {
      display: flex;
      gap: 10px;
      align-items: flex-start;
      padding: 12px;
      background-color: #f8f9fa;
      border-left: 4px solid #1976d2;
      margin-bottom: 8px;
      border-radius: 4px;
      transition: transform 0.2s;
    }

    .step:hover {
      transform: translateX(5px);
      background-color: #f5f5f5;
    }

    .step i {
      color: #1976d2;
      font-size: 1.2rem;
      min-width: 20px;
    }

    .step-details {
      flex: 1;
    }

    .step-details p {
      margin: 0;
    }

    .instruction {
      color: #333;
    }

    .distance {
      color: #666;
      font-size: 0.9rem;
      margin-top: 5px;
    }

    @media (max-width: 768px) {
      .content-container {
        flex-direction: column;
      }

      .route-info {
        max-width: none;
      }

      .map-container {
        height: 50vh;
      }
    }
  `]
})
export class MapComponent implements AfterViewInit, OnDestroy, OnInit {
  private map!: L.Map;
  private startMarker: L.Marker | null = null;
  private endMarker: L.Marker | null = null;
  private routeLayer: L.Polyline | null = null;
  
  startQuery: string = '';
  endQuery: string = '';
  startLocation: Location | null = null;
  endLocation: Location | null = null;
  routeInfo: { distance: number; duration: number } | null = null;
  routeSteps: RouteStep[] = [];

  @Input() center: [number, number] = [41.9028, 12.4964]; // Default: Roma
  @Input() zoom: number = 12;

  ngOnInit(): void {
    setTimeout(() => {
      this.initMap();
    }, 100);
  }

  ngAfterViewInit(): void {
    // Aggiungi listener per il ridimensionamento
    window.addEventListener('resize', () => {
      this.onResize();
    });
  }

  ngOnDestroy(): void {
    // Rimuovi listener quando il componente viene distrutto
    window.removeEventListener('resize', () => {
      this.onResize();
    });
  }

  private onResize(): void {
    if (this.map) {
      this.map.invalidateSize();
      
      // Se ci sono marker, centra la vista su di essi
      if (this.startMarker && this.endMarker) {
        const group = new L.FeatureGroup([this.startMarker, this.endMarker]);
        this.map.fitBounds(group.getBounds(), { padding: [50, 50] });
      } else if (this.startMarker) {
        this.map.setView(this.startMarker.getLatLng(), 13);
      } else if (this.endMarker) {
        this.map.setView(this.endMarker.getLatLng(), 13);
      }
    }
  }

  formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours} ore ${minutes} minuti`;
    }
    return `${minutes} minuti`;
  }

  async searchLocation(query: string): Promise<Location | null> {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const location = data[0];
        return {
          lat: parseFloat(location.lat),
          lon: parseFloat(location.lon),
          display_name: location.display_name
        };
      }
      return null;
    } catch (error) {
      console.error('Errore durante la ricerca della località:', error);
      return null;
    }
  }

  async searchStart(): Promise<void> {
    try {
      if (!this.startQuery) {
        alert('Inserisci un indirizzo di partenza');
        return;
      }

      const location = await this.searchLocation(this.startQuery);
      if (!location) {
        alert('Indirizzo di partenza non trovato');
        return;
      }

      this.startLocation = location;

      if (this.startMarker) {
        this.map.removeLayer(this.startMarker);
      }

      this.startMarker = L.marker([this.startLocation.lat, this.startLocation.lon], {
        draggable: true
      })
        .addTo(this.map)
        .bindPopup('Partenza: ' + this.startLocation.display_name)
        .openPopup();

      this.map.setView([this.startLocation.lat, this.startLocation.lon], 13);

      this.startMarker.on('dragend', async (event: L.DragEndEvent) => {
        const marker = event.target;
        const position = marker.getLatLng();
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.lat}&lon=${position.lng}`
          );
          const data = await response.json();

          this.startLocation = {
            lat: position.lat,
            lon: position.lng,
            display_name: data.display_name
          };

          marker.setPopupContent('Partenza: ' + data.display_name);
          
          if (this.endLocation) {
            await this.calculateRouteFromLocations();
          }
        } catch (error) {
          console.error('Errore durante l\'aggiornamento della posizione:', error);
          alert('Si è verificato un errore durante l\'aggiornamento della posizione');
        }
      });
    } catch (error) {
      console.error('Errore durante la ricerca dell\'indirizzo di partenza:', error);
      alert('Si è verificato un errore durante la ricerca dell\'indirizzo di partenza');
    }
  }

  async searchEnd(): Promise<void> {
    try {
      if (!this.endQuery) {
        alert('Inserisci un indirizzo di destinazione');
        return;
      }

      const location = await this.searchLocation(this.endQuery);
      if (!location) {
        alert('Indirizzo di destinazione non trovato');
        return;
      }

      this.endLocation = location;

      if (this.endMarker) {
        this.map.removeLayer(this.endMarker);
      }

      this.endMarker = L.marker([this.endLocation.lat, this.endLocation.lon], {
        draggable: true
      })
        .addTo(this.map)
        .bindPopup('Arrivo: ' + this.endLocation.display_name)
        .openPopup();

      this.map.setView([this.endLocation.lat, this.endLocation.lon], 13);

      this.endMarker.on('dragend', async (event: L.DragEndEvent) => {
        const marker = event.target;
        const position = marker.getLatLng();
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.lat}&lon=${position.lng}`
          );
          const data = await response.json();

          this.endLocation = {
            lat: position.lat,
            lon: position.lng,
            display_name: data.display_name
          };

          marker.setPopupContent('Arrivo: ' + data.display_name);
          
          if (this.startLocation) {
            await this.calculateRouteFromLocations();
          }
        } catch (error) {
          console.error('Errore durante l\'aggiornamento della posizione:', error);
          alert('Si è verificato un errore durante l\'aggiornamento della posizione');
        }
      });
    } catch (error) {
      console.error('Errore durante la ricerca dell\'indirizzo di destinazione:', error);
      alert('Si è verificato un errore durante la ricerca dell\'indirizzo di destinazione');
    }
  }

  async calculateRoute(): Promise<void> {
    try {
      if (!this.startQuery || !this.endQuery) {
        alert('Per favore inserisci sia l\'indirizzo di partenza che quello di destinazione');
        return;
      }

      // Se non sono stati ancora cercati gli indirizzi, cercali ora
      if (!this.startLocation) {
        await this.searchStart();
      }
      if (!this.endLocation) {
        await this.searchEnd();
      }

      // Se uno dei due indirizzi non è stato trovato, la ricerca sopra mostrerà già un errore
      if (!this.startLocation || !this.endLocation) {
        return;
      }

      // Calcola il percorso
      await this.calculateRouteFromLocations();

    } catch (error) {
      console.error('Errore durante il calcolo del percorso:', error);
      alert('Si è verificato un errore durante il calcolo del percorso. Riprova più tardi.');
    }
  }

  private async calculateRouteFromLocations(): Promise<void> {
    if (!this.startLocation || !this.endLocation) return;

    try {
      if (this.routeLayer) {
        this.map.removeLayer(this.routeLayer);
      }

      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${this.startLocation.lon},${this.startLocation.lat};${this.endLocation.lon},${this.endLocation.lat}?overview=full&geometries=geojson&steps=true`
      );
      const data: OSRMResponse = await response.json();

      if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        
        this.routeInfo = {
          distance: route.distance,
          duration: route.duration
        };

        this.routeSteps = route.legs[0].steps.map((step: OSRMStep) => {
          let instruction = step.maneuver.instruction;
          const streetName = step.name || 'strada senza nome';
          const maneuverType = step.maneuver.type;
          const direction = step.maneuver.modifier || '';
          
          if (maneuverType === 'turn') {
            instruction = `Svolta ${this.translateDirection(direction)} su ${streetName}`;
          } else if (maneuverType === 'new name') {
            instruction = `Continua su ${streetName}`;
          } else if (maneuverType === 'depart') {
            instruction = `Parti da ${streetName}`;
          } else if (maneuverType === 'arrive') {
            instruction = `Arrivo a destinazione su ${streetName}`;
          } else if (maneuverType === 'roundabout') {
            instruction = `Alla rotonda prendi l'uscita su ${streetName}`;
          }

          return {
            instruction,
            distance: step.distance,
            streetName,
            maneuverType,
            direction,
            icon: this.getManeuverIcon(maneuverType, direction)
          };
        });

        const coordinates: L.LatLngExpression[] = route.geometry.coordinates.map(
          (coord: [number, number]) => [coord[1], coord[0]]
        );
        
        this.routeLayer = L.polyline(coordinates, {
          color: '#2196F3',
          weight: 5,
          opacity: 0.7
        }).addTo(this.map);

        this.map.fitBounds(this.routeLayer.getBounds(), {
          padding: [50, 50]
        });
      } else {
        alert('Non è stato possibile trovare un percorso tra i due punti');
      }
    } catch (error) {
      console.error('Errore durante il calcolo del percorso:', error);
      alert('Si è verificato un errore durante il calcolo del percorso. Riprova più tardi.');
    }
  }

  private decodePolyline(str: string, precision: number = 5): [number, number][] {
    let index = 0;
    let lat = 0;
    let lng = 0;
    const coordinates: [number, number][] = [];
    let shift = 0;
    let result = 0;
    let byte = null;
    let latitude_change: number;
    let longitude_change: number;
    const factor = Math.pow(10, precision);

    while (index < str.length) {
      byte = null;
      shift = 0;
      result = 0;

      do {
        byte = str.charCodeAt(index++) - 63;
        result |= (byte & 0x1f) << shift;
        shift += 5;
      } while (byte >= 0x20);

      latitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

      shift = result = 0;

      do {
        byte = str.charCodeAt(index++) - 63;
        result |= (byte & 0x1f) << shift;
        shift += 5;
      } while (byte >= 0x20);

      longitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

      lat += latitude_change;
      lng += longitude_change;

      coordinates.push([lat / factor, lng / factor]);
    }

    return coordinates;
  }

  private getManeuverIcon(type: string, modifier?: string): string {
    const iconMap: IconMap = {
      'depart': '<i class="fas fa-play"></i>',
      'arrive': '<i class="fas fa-flag-checkered"></i>',
      'turn': {
        'left': '<i class="fas fa-arrow-left"></i>',
        'right': '<i class="fas fa-arrow-right"></i>',
        'slight left': '<i class="fas fa-arrow-left" style="transform: rotate(45deg);"></i>',
        'slight right': '<i class="fas fa-arrow-right" style="transform: rotate(-45deg);"></i>',
        'sharp left': '<i class="fas fa-arrow-left" style="transform: rotate(-45deg);"></i>',
        'sharp right': '<i class="fas fa-arrow-right" style="transform: rotate(45deg);"></i>',
        'straight': '<i class="fas fa-arrow-up"></i>',
        'uturn': '<i class="fas fa-arrow-circle-left"></i>'
      },
      'new name': '<i class="fas fa-arrow-up"></i>',
      'roundabout': '<i class="fas fa-circle-notch"></i>',
      'merge': '<i class="fas fa-compress-arrows-alt"></i>',
      'fork': '<i class="fas fa-code-branch"></i>',
      'motorway': '<i class="fas fa-road"></i>'
    };

    if (type === 'turn' && modifier) {
      const turnIcons = iconMap['turn'];
      if (typeof turnIcons === 'object' && modifier in turnIcons) {
        return turnIcons[modifier];
      }
    }

    const icon = iconMap[type];
    return typeof icon === 'string' ? icon : '<i class="fas fa-arrow-up"></i>';
  }

  private translateDirection(direction: string): string {
    const directions: { [key: string]: string } = {
      'left': 'a sinistra',
      'right': 'a destra',
      'slight left': 'leggermente a sinistra',
      'slight right': 'leggermente a destra',
      'sharp left': 'bruscamente a sinistra',
      'sharp right': 'bruscamente a destra',
      'straight': 'dritto',
      'uturn': 'inversione a U'
    };
    return directions[direction] || direction;
  }

  async locateMe(): Promise<void> {
    if (!navigator.geolocation) {
      alert('La geolocalizzazione non è supportata dal tuo browser');
      return;
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        });
      });

      const { latitude, longitude } = position.coords;

      // Ottieni l'indirizzo dalla posizione
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );
      const data = await response.json();

      // Imposta la posizione di partenza
      this.startLocation = {
        lat: latitude,
        lon: longitude,
        display_name: data.display_name
      };
      this.startQuery = data.display_name;

      // Aggiorna il marker di partenza
      if (this.startMarker) {
        this.map.removeLayer(this.startMarker);
      }

      this.startMarker = L.marker([latitude, longitude])
        .addTo(this.map)
        .bindPopup('Partenza: ' + data.display_name)
        .openPopup();

      this.map.setView([latitude, longitude], 16);

      // Se c'è già una destinazione, calcola il percorso
      if (this.endLocation) {
        await this.calculateRouteFromLocations();
      }

    } catch (error) {
      if (error instanceof GeolocationPositionError) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            alert('Per favore abilita l\'accesso alla posizione nelle impostazioni del browser');
            break;
          case error.POSITION_UNAVAILABLE:
            alert('Informazioni sulla posizione non disponibili');
            break;
          case error.TIMEOUT:
            alert('Richiesta della posizione scaduta');
            break;
          default:
            alert('Si è verificato un errore durante la geolocalizzazione');
        }
      } else {
        console.error('Errore durante la geolocalizzazione:', error);
        alert('Si è verificato un errore durante la ricerca della tua posizione');
      }
    }
  }

  private initMap(): void {
    // Attendi che il DOM sia completamente caricato
    setTimeout(() => {
      const iconDefault = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });
      L.Marker.prototype.options.icon = iconDefault;

      this.map = L.map('map', {
        zoomControl: true,
        maxZoom: 18,
        attributionControl: false  // Disabilita il controllo di attribuzione predefinito
      }).setView(this.center, this.zoom);

      // Aggiungi un controllo di attribuzione personalizzato
      L.control.attribution({
        prefix: ' OpenStreetMap contributors'
      }).addTo(this.map);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: ''  // Rimuovi l'attribuzione dal tileLayer poiché l'abbiamo già aggiunta sopra
      }).addTo(this.map);

      // Forza il ridimensionamento della mappa
      this.map.invalidateSize();
      
      // Aggiungi controllo dello zoom in alto a destra
      this.map.zoomControl.setPosition('topright');
    }, 100);
  }
}
