import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="footer-trigger"></div>
    <footer class="footer">
      <div class="footer-content">
        <p> 2024 SitoFR - Creato da Romolo F</p>
        <div class="social-links">
          <a href="#" class="social-link">
            <i class="fab fa-github"></i>
          </a>
          <a href="#" class="social-link">
            <i class="fab fa-linkedin"></i>
          </a>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    :host {
      display: block;
      height: 0;
    }

    .footer-trigger {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 20px;
      z-index: 999;
    }

    .footer {
      background-color: #fff3bf;
      color: #000000;
      padding: 0.5rem 1rem;
      position: fixed;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%) translateY(calc(100% - 4px));
      margin-bottom: 8px;
      border-radius: 8px;
      width: max-content;
      min-width: min-content;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      z-index: 1000;
      box-sizing: border-box;
      transition: transform 0.3s ease;
    }

    .footer-trigger:hover + .footer,
    .footer:hover {
      transform: translateX(-50%) translateY(0);
    }

    .footer-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1.5rem;
      padding: 0 1rem;
      height: 100%;
    }

    .footer p {
      margin: 0;
      font-size: 0.9rem;
      white-space: nowrap;
    }

    .social-links {
      display: flex;
      gap: 0.75rem;
    }

    .social-link {
      color: #000000;
      font-size: 1.1rem;
      opacity: 0.8;
      transition: opacity 0.3s ease;
      text-decoration: none;
      padding: 0.25rem;
    }

    .social-link:hover {
      opacity: 1;
    }

    @media (max-width: 768px) {
      .footer {
        width: calc(100% - 2rem);
        margin: 0 1rem 8px 1rem;
      }

      .footer-content {
        flex-direction: row;
        gap: 1rem;
        justify-content: space-between;
      }

      .footer p {
        font-size: 0.8rem;
      }

      .social-links {
        gap: 0.8rem;
      }

      .social-link {
        font-size: 1rem;
      }
    }
  `]
})
export class FooterComponent {}
