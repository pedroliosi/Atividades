import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading',
  standalone: true,
  template: `
    @if (mostrar) {
      <div class="loading">
        <span></span>
        <p>{{ texto }}</p>
      </div>
    }
  `,
  styles: `
    .loading {
      align-items: center;
      color: #52606d;
      display: grid;
      gap: 12px;
      justify-items: center;
      padding: 36px;
    }

    span {
      animation: girar 0.8s linear infinite;
      border: 3px solid #d7dee8;
      border-top-color: #3a3f46;
      border-radius: 999px;
      height: 34px;
      width: 34px;
    }

    p {
      margin: 0;
      font-weight: 600;
    }

    @keyframes girar {
      to {
        transform: rotate(360deg);
      }
    }
  `,
})
export class Loading {
  @Input() mostrar = false;
  @Input() texto = 'Carregando...';
}
