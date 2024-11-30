import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';

@Component({
  selector: 'app-geolocalizzazione',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="geolocation-page">
      <div class="info-panel">
        <div class="coordinates" *ngIf="currentPosition">
          <h2>La tua posizione attuale:</h2>
          <p><strong>Latitudine:</strong> {{currentPosition.lat.toFixed(6)}}</p>
          <p><strong>Longitudine:</strong> {{currentPosition.lng.toFixed(6)}}</p>
        </div>
        <div class="actions">
          <button class="locate-btn" (click)="locateMe()" [disabled]="isLocating">
            <i class="fas fa-location-crosshairs"></i>
            {{isLocating ? 'Localizzando...' : 'Trova la mia posizione'}}
          </button>
        </div>
        <div class="status-message" *ngIf="statusMessage" [class.error]="isError">
          {{ statusMessage }}
        </div>
      </div>
      <div class="map-container">
        <div id="geolocalizzazione-map"></div>
      </div>
    </div>
  `,
  styles: [`
    .geolocation-page {
      display: flex;
      flex-direction: column;
      height: 100vh;
      width: 100vw;
      margin: 0;
      padding: 0;
      overflow: hidden;
      background-color: #f5f5f5;
    }

    .info-panel {
      padding: 20px;
      background: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      z-index: 1000;
    }

    .coordinates {
      margin-bottom: 20px;
    }

    .coordinates h2 {
      color: #333;
      font-size: 1.5em;
      margin-bottom: 10px;
    }

    .coordinates p {
      margin: 5px 0;
      color: #666;
    }

    .coordinates strong {
      color: #333;
    }

    .actions {
      margin-bottom: 15px;
    }

    .locate-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      padding: 12px 20px;
      background: #2196F3;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1em;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }

    .locate-btn:hover {
      background: #1976D2;
    }

    .locate-btn:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    .locate-btn i {
      margin-right: 8px;
    }

    .status-message {
      padding: 10px;
      margin-top: 10px;
      border-radius: 4px;
      background: #e8f5e9;
      color: #2e7d32;
      text-align: center;
    }

    .status-message.error {
      background: #ffebee;
      color: #c62828;
    }

    .map-container {
      flex: 1;
      position: relative;
      width: 100%;
      min-height: 400px;
    }

    #geolocalizzazione-map {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 1;
    }

    @media (max-width: 768px) {
      .geolocation-page {
        height: 100vh;
      }

      .info-panel {
        padding: 15px;
      }

      .coordinates h2 {
        font-size: 1.2em;
      }

      .locate-btn {
        padding: 10px 15px;
        font-size: 0.9em;
      }
    }
  `]
})
export class GeolocalizzazioneComponent implements OnInit {
  private map!: L.Map;
  private marker?: L.Marker;
  currentPosition?: { lat: number, lng: number };
  isLocating = false;
  statusMessage = '';
  isError = false;

  ngOnInit() {
    setTimeout(() => {
      this.initMap();
    }, 100);
  }

  private initMap() {
    if (this.map) {
      this.map.remove();
    }

    this.map = L.map('geolocalizzazione-map', {
      center: [41.9028, 12.4964],
      zoom: 6,
      zoomControl: true,
      attributionControl: true
    });

    this.map.zoomControl.setPosition('topright');

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: ' OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(this.map);

    setTimeout(() => {
      this.map.invalidateSize();
    }, 100);
  }

  locateMe() {
    if (!navigator.geolocation) {
      this.showError('La geolocalizzazione non è supportata dal tuo browser.');
      return;
    }

    this.isLocating = true;
    this.statusMessage = 'Ricerca della posizione in corso...';
    this.isError = false;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
        this.currentPosition = { lat, lng };
        
        if (this.marker) {
          this.map.removeLayer(this.marker);
        }

        this.marker = L.marker([lat, lng], {
          icon: L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
          })
        }).addTo(this.map);

        this.map.setView([lat, lng], 15);
        this.marker.bindPopup('La tua posizione attuale').openPopup();
        
        this.isLocating = false;
        this.statusMessage = 'Posizione trovata con successo!';
      },
      (error) => {
        let errorMsg = 'Errore durante la ricerca della posizione.';
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMsg = 'Permesso di geolocalizzazione negato.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMsg = 'Informazioni sulla posizione non disponibili.';
            break;
          case error.TIMEOUT:
            errorMsg = 'Timeout nella ricerca della posizione.';
            break;
        }
        this.showError(errorMsg);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  }

  private showError(message: string) {
    this.statusMessage = message;
    this.isError = true;
    this.isLocating = false;
  }
}
