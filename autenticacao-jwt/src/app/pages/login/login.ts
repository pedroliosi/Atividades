import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly fb = inject(FormBuilder);

  readonly carregando = signal(false);
  readonly erro = signal('');

  readonly form = this.fb.nonNullable.group({
    email: ['admin@mail.com', [Validators.required, Validators.email]],
    password: ['admin123', [Validators.required]],
  });

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {}

  entrar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.carregando.set(true);
    this.erro.set('');

    this.authService.login(this.form.getRawValue()).subscribe({
      next: () => this.router.navigateByUrl('/produtos'),
      error: () => {
        this.erro.set('Não foi possível entrar. Verifique e-mail e senha.');
        this.carregando.set(false);
      },
    });
  }
}
