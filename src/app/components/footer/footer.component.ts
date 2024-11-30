import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
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
    .footer {
      background-color: #1976d2;
      color: white;
      padding: 1rem;
      box-shadow: 0 -2px 8px rgba(0,0,0,0.2);
    }

    .footer-content {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .footer p {
      margin: 0;
      font-size: 0.9rem;
    }

    .social-links {
      display: flex;
      gap: 1rem;
    }

    .social-link {
      color: white;
      font-size: 1.2rem;
      opacity: 0.8;
      transition: opacity 0.3s ease;
    }

    .social-link:hover {
      opacity: 1;
    }

    @media (max-width: 768px) {
      .footer-content {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }
    }
  `]
})
export class FooterComponent {

}
