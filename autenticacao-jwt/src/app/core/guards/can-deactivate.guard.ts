import { CanDeactivateFn } from '@angular/router';

export interface PodeSairComSeguranca {
  existemAlteracoesNaoSalvas: () => boolean;
}

export const canDeactivateGuard: CanDeactivateFn<PodeSairComSeguranca> = (component) => {
  if (!component.existemAlteracoesNaoSalvas()) {
    return true;
  }

  return confirm('Existem alterações não salvas. Deseja realmente sair?');
};
