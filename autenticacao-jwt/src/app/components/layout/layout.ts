import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {
  readonly menuUsuarioAberto = signal(false);

  constructor(private readonly authService: AuthService) {}

  alternarMenuUsuario(): void {
    this.menuUsuarioAberto.update((aberto) => !aberto);
  }

  sair(): void {
    this.authService.sair();
  }
}
