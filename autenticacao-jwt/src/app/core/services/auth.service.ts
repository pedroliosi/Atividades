import { HttpClient } from '@angular/common/http';
import { Injectable, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse } from '../../models/auth';
import { User } from '../../models/user';

const TOKEN_KEY = 'autenticacao_jwt_token';
const REFRESH_TOKEN_KEY = 'autenticacao_jwt_refresh_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenSignal = signal<string | null>(localStorage.getItem(TOKEN_KEY));

  readonly token = computed(() => this.tokenSignal());
  readonly autenticado = computed(() => !!this.tokenSignal());

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
  ) {}

  login(credenciais: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, credenciais).pipe(
      tap((resposta) => this.salvarTokens(resposta)),
    );
  }

  perfil(): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/auth/profile`);
  }

  sair(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    this.tokenSignal.set(null);
    this.router.navigateByUrl('/login');
  }

  redirecionarParaLogin(): void {
    this.router.navigateByUrl('/login');
  }

  private salvarTokens(resposta: LoginResponse): void {
    localStorage.setItem(TOKEN_KEY, resposta.access_token);
    localStorage.setItem(REFRESH_TOKEN_KEY, resposta.refresh_token);
    this.tokenSignal.set(resposta.access_token);
  }
}
