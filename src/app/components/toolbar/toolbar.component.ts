import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="toolbar">
      <div class="logo-container" routerLink="/">
        <i class="fas fa-map-location-dot"></i>
        <span class="logo-text">SitoFR</span>
      </div>
      <nav class="navigation">
        <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-link">Home</a>
        <a routerLink="/map" routerLinkActive="active" class="nav-link">Mappa</a>
        <a routerLink="/percorsi" routerLinkActive="active" class="nav-link">Percorsi</a>
        <a routerLink="/geolocalizzazione" routerLinkActive="active" class="nav-link">Geolocalizzazione</a>
        <a routerLink="/info" routerLinkActive="active" class="nav-link">Info</a>
      </nav>
    </div>
  `,
  styles: [`
    @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');

    .toolbar {
      height: 64px;
      background-color: #1976d2;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      display: flex;
      align-items: center;
      padding: 0 1rem;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
    }

    .logo-container {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      cursor: pointer;
      text-decoration: none;
      color: white;
      transition: opacity 0.3s ease;
      margin-right: 2rem;
    }

    .logo-container:hover {
      opacity: 0.9;
    }

    .logo-container i {
      font-size: 1.5rem;
    }

    .logo-text {
      font-size: 1.5rem;
      font-weight: 500;
    }

    .navigation {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .nav-link {
      color: rgba(255, 255, 255, 0.8);
      text-decoration: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      transition: all 0.3s ease;
      font-weight: 500;
    }

    .nav-link:hover {
      color: white;
      background-color: rgba(255, 255, 255, 0.1);
    }

    .nav-link.active {
      color: white;
      background-color: rgba(255, 255, 255, 0.2);
    }

    @media (max-width: 768px) {
      .toolbar {
        padding: 0 0.5rem;
      }

      .logo-container {
        margin-right: 1rem;
        padding: 0.5rem;
      }

      .logo-text {
        display: none;
      }

      .navigation {
        gap: 0.5rem;
      }

      .nav-link {
        padding: 0.5rem;
        font-size: 0.9rem;
      }
    }
  `]
})
export class ToolbarComponent { }
