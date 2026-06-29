import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

import { AuthService } from '../services/auth.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.token();

  let requisicao = req;

  if (token) {
    requisicao = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  } else if (!req.url.includes('/auth/login')) {
    router.navigateByUrl('/login');
  }

  return next(requisicao).pipe(
    catchError((erro) => {
      if (erro.status === 401) {
        authService.sair();
      }

      return throwError(() => erro);
    }),
  );
};
