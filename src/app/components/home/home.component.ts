import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="home-container">
      <header class="hero">
        <h1>Benvenuto in SitoFR</h1>
        <p>Esplora la mappa interattiva e scopri nuovi luoghi</p>
      </header>

      <section class="features">
        <div class="feature-card" (click)="navigateTo('/map')">
          <i class="fas fa-map-marked-alt"></i>
          <h3>Mappa Interattiva</h3>
          <p>Esplora luoghi e trova percorsi con la nostra mappa interattiva</p>
        </div>

        <div class="feature-card" (click)="navigateTo('/percorsi')">
          <i class="fas fa-route"></i>
          <h3>Calcolo Percorsi</h3>
          <p>
            Trova il percorso migliore tra due punti con indicazioni dettagliate
          </p>
        </div>

        <div class="feature-card" (click)="navigateTo('/geolocalizzazione')">
          <i class="fas fa-location-crosshairs"></i>
          <h3>Geolocalizzazione</h3>
          <p>Trova la tua posizione attuale con un solo click</p>
        </div>
      </section>
    </div>
  `,
  styles: [
    `
      @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');

      .home-container {
        width: 100%;
        margin: 0;
        background-image: url('https://www.instantdeveloper.com/wp-content/uploads/2022/05/20220503Blog-main-IDF-compr-2048x1152.png');
        background-size: cover;
        background-position: center;
        padding: 1rem;
        min-height: 200vh; /* Imposta l'altezza minima al 100% della viewport */
        border-radius: 15px; /* Arrotonda i bordi */
      }

      .hero {
        text-align: center;
        margin-bottom: 3rem;
      }

      .hero h1 {
        font-size: 2.5rem;
        color: #2196f3;
        margin-bottom: 1rem;
      }

      .hero p {
        font-size: 1.2rem;
        color: #666;
      }

      .features {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 2rem;
        padding: 1rem;
      }

      .feature-card {
        background: white;
        padding: 2rem;
        border-radius: 8px;
        text-align: center;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease;
        cursor: pointer;
      }

      .feature-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      }

      .feature-card i {
        font-size: 2.5rem;
        color: #2196f3;
        margin-bottom: 1rem;
      }

      .feature-card h3 {
        color: #333;
        margin-bottom: 1rem;
      }

      .feature-card p {
        color: #666;
        line-height: 1.6;
      }

      @media (max-width: 768px) {
        .hero h1 {
          font-size: 2rem;
        }

        .hero p {
          font-size: 1rem;
        }

        .features {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class HomeComponent {
  constructor(private router: Router) {}

  navigateTo(path: string) {
    this.router.navigate([path]);
  }
}
