import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToolbarComponent, FooterComponent],
  template: `
    <div class="app-container">
      <div class="toolbar-trigger" (mouseenter)="showToolbar()"></div>
      <app-toolbar class="toolbar" [class.hidden]="!isToolbarVisible" (mouseleave)="hideToolbar()"></app-toolbar>
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
      <app-footer class="fixed-bottom"></app-footer>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      padding-top: 40px;
      padding-bottom: 40px;
      position: relative;
      background-color: #f0f2f5;
    }

    .toolbar-trigger {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 20px;
      z-index: 999;
      background: linear-gradient(to bottom, rgba(25, 118, 210, 0.1), transparent);
    }

    .toolbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      transition: all 0.3s ease-in-out;
      transform: translateY(0);
      background-color: #1976d2;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .toolbar.hidden {
      transform: translateY(-100%);
    }

    .fixed-bottom {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      background-color: #1976d2;
      color: white;
      box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
    }

    .main-content {
      min-height: calc(100vh - 80px);
      background-color: #ffffff;
      margin-top: 20px;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      padding: 20px;
    }

    @media (max-width: 768px) {
      .main-content {
        margin-top: 10px;
        padding: 10px;
      }
    }
  `]
})
export class AppComponent {
  title = 'sitoFR';
  isToolbarVisible = false;

  showToolbar() {
    this.isToolbarVisible = true;
  }

  hideToolbar() {
    this.isToolbarVisible = false;
  }
}
