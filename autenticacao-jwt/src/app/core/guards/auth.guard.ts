import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  return verificarAutenticacao();
};

export const authChildGuard: CanActivateChildFn = () => {
  return verificarAutenticacao();
};

function verificarAutenticacao() {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.autenticado()) {
    return true;
  }

  return router.createUrlTree(['/login']);
}
