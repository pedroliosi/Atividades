import { Routes } from '@angular/router';

import { authChildGuard, authGuard } from './core/guards/auth.guard';
import { canDeactivateGuard } from './core/guards/can-deactivate.guard';
import { Layout } from './components/layout/layout';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
  },
  {
    path: '',
    component: Layout,
    canActivate: [authGuard],
    canActivateChild: [authChildGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'produtos',
      },
      {
        path: 'produtos',
        loadComponent: () => import('./pages/produtos/produtos').then((m) => m.Produtos),
      },
      {
        path: 'produtos/novo',
        loadComponent: () => import('./pages/produtos/produto-formulario').then((m) => m.ProdutoFormulario),
        canDeactivate: [canDeactivateGuard],
      },
      {
        path: 'produtos/editar/:id',
        loadComponent: () => import('./pages/produtos/produto-formulario').then((m) => m.ProdutoFormulario),
        canDeactivate: [canDeactivateGuard],
      },
      {
        path: 'categorias',
        loadComponent: () => import('./pages/categorias/categorias').then((m) => m.Categorias),
      },
      {
        path: 'categorias/nova',
        loadComponent: () => import('./pages/categorias/categoria-formulario').then((m) => m.CategoriaFormulario),
        canDeactivate: [canDeactivateGuard],
      },
      {
        path: 'categorias/editar/:id',
        loadComponent: () => import('./pages/categorias/categoria-formulario').then((m) => m.CategoriaFormulario),
        canDeactivate: [canDeactivateGuard],
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'produtos',
  },
];
