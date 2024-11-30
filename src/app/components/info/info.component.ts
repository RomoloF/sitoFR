import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-info',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="info-container">
      <section class="about-section">
        <h2>Chi Sono</h2>
        <div class="content">
          <div class="profile">
            <i class="fas fa-user-circle"></i>
            <h3>Romolo F</h3>
            <p class="title">Sviluppatore Web</p>
          </div>
          <p class="description">
            Benvenuto nella sezione informativa del mio sito! Sono uno sviluppatore appassionato
            di tecnologie web e mappatura digitale. Questo progetto è stato creato utilizzando
            Angular e Leaflet per fornire un'esperienza di mappatura interattiva.
          </p>
        </div>
      </section>

      <section class="tech-section">
        <h2>Tecnologie Utilizzate</h2>
        <div class="tech-grid">
          <a href="https://angular.io" target="_blank" class="tech-card">
            <i class="fab fa-angular"></i>
            <h4>Angular</h4>
            <p>Framework per applicazioni web</p>
          </a>
          <a href="https://leafletjs.com" target="_blank" class="tech-card">
            <i class="fas fa-map"></i>
            <h4>Leaflet</h4>
            <p>Libreria per mappe interattive</p>
          </a>
          <a href="https://www.w3.org/Style/CSS/" target="_blank" class="tech-card">
            <i class="fab fa-css3"></i>
            <h4>CSS3</h4>
            <p>Styling moderno e responsive</p>
          </a>
        </div>
      </section>

      <section class="contact-section">
        <h2>Contatti</h2>
        <div class="contact-info">
          <div class="contact-item">
            <i class="fas fa-envelope"></i>
            <p>email&#64;example.com</p>
          </div>
          <div class="contact-item">
            <i class="fas fa-phone"></i>
            <p>+39 XXX XXX XXXX</p>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .info-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    section {
      margin-bottom: 3rem;
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    h2 {
      color: #1976d2;
      margin-bottom: 1.5rem;
      font-size: 1.8rem;
    }

    .content {
      display: flex;
      gap: 2rem;
      align-items: center;
    }

    .profile {
      text-align: center;
      padding: 1rem;
    }

    .profile i {
      font-size: 4rem;
      color: #1976d2;
      margin-bottom: 1rem;
    }

    .profile h3 {
      margin: 0;
      color: #333;
      font-size: 1.4rem;
    }

    .profile .title {
      color: #666;
      margin-top: 0.5rem;
    }

    .description {
      flex: 1;
      line-height: 1.6;
      color: #444;
    }

    .tech-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
    }

    .tech-card {
      text-align: center;
      padding: 2rem;
      background: #f8f9fa;
      border-radius: 8px;
      transition: all 0.3s ease;
      text-decoration: none;
      color: inherit;
      border: 2px solid transparent;
    }

    .tech-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
      border-color: #1976d2;
      background: white;
    }

    .tech-card i {
      font-size: 3rem;
      color: #1976d2;
      margin-bottom: 1rem;
    }

    .tech-card h4 {
      margin: 0.5rem 0;
      color: #333;
      font-size: 1.2rem;
    }

    .tech-card p {
      color: #666;
      margin: 0;
    }

    .contact-info {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
    }

    .contact-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .contact-item i {
      font-size: 1.5rem;
      color: #1976d2;
    }

    .contact-item p {
      margin: 0;
      color: #444;
    }

    @media (max-width: 768px) {
      .info-container {
        padding: 1rem;
      }

      .content {
        flex-direction: column;
        text-align: center;
      }

      .description {
        text-align: left;
      }

      section {
        padding: 1.5rem;
      }
    }
  `]
})
export class InfoComponent {}
