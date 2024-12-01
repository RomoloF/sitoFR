import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="toolbar-trigger"></div>
    <div class="toolbar">
      <div class="toolbar-content">
        <div class="logo-container" routerLink="/">
          <i class="fas fa-map-location-dot"></i>
          <span class="logo-text">SitoFR</span>
        </div>
        <nav class="navigation">
          <a
            routerLink="/"
            routerLinkActive="active"
            [routerLinkActiveOptions]="{ exact: true }"
            class="nav-link"
          >Home</a>
          <a 
            routerLink="/map" 
            routerLinkActive="active" 
            class="nav-link"
          >Mappa</a>
          <a 
            routerLink="/percorsi" 
            routerLinkActive="active" 
            class="nav-link"
          >Percorsi</a>
          <a
            routerLink="/geolocalizzazione"
            routerLinkActive="active"
            class="nav-link"
          >Geolocalizzazione</a>
          <a 
            routerLink="/info" 
            routerLinkActive="active" 
            class="nav-link"
          >Info</a>
        </nav>
      </div>
    </div>
  `,
  styles: [`
    @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');

    .toolbar-trigger {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 20px;
      z-index: 999;
    }

    .toolbar {
      background-color: #fff3bf;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      padding: 0.5rem 1rem;
      position: fixed;
      top: 0;
      left: 50%;
      transform: translateX(-50%) translateY(calc(-100% + 4px));
      z-index: 1000;
      border-radius: 8px;
      width: max-content;
      min-width: min-content;
      margin: 8px auto 0;
      transition: transform 0.3s ease;
    }

    .toolbar-trigger:hover + .toolbar,
    .toolbar:hover {
      transform: translateX(-50%) translateY(0);
    }

    .toolbar-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 2rem;
      padding: 0 1rem;
    }

    .logo-container {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.25rem 0.5rem;
      cursor: pointer;
      text-decoration: none;
      color: #000000;
      transition: opacity 0.3s ease;
      margin-right: 1rem;
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
      color: rgba(0, 0, 0, 0.8);
      text-decoration: none;
      padding: 0.25rem 0.75rem;
      border-radius: 4px;
      transition: all 0.3s ease;
      font-weight: 500;
    }

    .nav-link:hover {
      color: #000000;
      background-color: rgba(0, 0, 0, 0.05);
    }

    .nav-link.active {
      color: #000000;
      background-color: rgba(0, 0, 0, 0.1);
    }

    @media (max-width: 768px) {
      .toolbar {
        width: calc(100% - 2rem);
        margin: 8px 1rem 0;
      }

      .toolbar-content {
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
export class ToolbarComponent {}
