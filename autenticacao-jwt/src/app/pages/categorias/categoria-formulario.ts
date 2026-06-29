import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { PodeSairComSeguranca } from '../../core/guards/can-deactivate.guard';
import { CategoryService } from '../../core/services/category.service';
import { Loading } from '../../shared/loading/loading';

@Component({
  selector: 'app-categoria-formulario',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, Loading],
  templateUrl: './categoria-formulario.html',
  styleUrl: './categoria-formulario.css',
})
export class CategoriaFormulario implements OnInit, PodeSairComSeguranca {
  private readonly fb = inject(FormBuilder);

  readonly carregando = signal(false);
  readonly erro = signal('');
  readonly sucesso = signal('');
  readonly id = signal<number | null>(null);
  readonly titulo = computed(() => (this.id() ? 'Editar Categoria' : 'Nova Categoria'));

  readonly form = this.fb.nonNullable.group({
    nome: ['', [Validators.required, Validators.minLength(3)]],
    imagem: ['', [Validators.required]],
  });

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly categoryService: CategoryService,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.id.set(Number.isFinite(id) && id > 0 ? id : null);

    if (!this.id()) {
      return;
    }

    this.carregando.set(true);
    this.categoryService
      .buscarPorId(this.id()!)
      .pipe(finalize(() => this.carregando.set(false)))
      .subscribe({
        next: (categoria) => {
          this.form.patchValue({
            nome: categoria.name,
            imagem: categoria.image,
          });
          this.form.markAsPristine();
        },
        error: () => this.erro.set('Não foi possível carregar os dados da categoria.'),
      });
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.sucesso.set(this.id() ? 'Simulação de edição realizada.' : 'Simulação de cadastro realizada com sucesso.');
    this.form.markAsPristine();
  }

  cancelar(): void {
    this.router.navigateByUrl('/categorias');
  }

  existemAlteracoesNaoSalvas(): boolean {
    return this.form.dirty;
  }
}
