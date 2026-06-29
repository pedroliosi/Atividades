import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize, forkJoin, of, switchMap } from 'rxjs';

import { PodeSairComSeguranca } from '../../core/guards/can-deactivate.guard';
import { CategoryService } from '../../core/services/category.service';
import { ProductService } from '../../core/services/product.service';
import { Category } from '../../models/category';
import { imagemProdutoUrl } from '../../shared/image-url';
import { Loading } from '../../shared/loading/loading';

@Component({
  selector: 'app-produto-formulario',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, Loading],
  templateUrl: './produto-formulario.html',
  styleUrl: './produto-formulario.css',
})
export class ProdutoFormulario implements OnInit, PodeSairComSeguranca {
  private readonly fb = inject(FormBuilder);

  readonly carregando = signal(false);
  readonly erro = signal('');
  readonly sucesso = signal('');
  readonly categorias = signal<Category[]>([]);
  readonly id = signal<number | null>(null);
  readonly titulo = computed(() => (this.id() ? 'Editar Produto' : 'Novo Produto'));

  readonly form = this.fb.nonNullable.group({
    nome: ['', [Validators.required, Validators.minLength(3)]],
    preco: [0, [Validators.required, Validators.min(1)]],
    descricao: ['', [Validators.required, Validators.minLength(10)]],
    categoria: ['', [Validators.required]],
    imagem: ['', [Validators.required]],
  });

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly productService: ProductService,
    private readonly categoryService: CategoryService,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.id.set(Number.isFinite(id) && id > 0 ? id : null);
    this.carregando.set(true);

    this.categoryService
      .listar()
      .pipe(
        switchMap((categorias) => {
          this.categorias.set(categorias);
          return this.id() ? forkJoin({ produto: this.productService.buscarPorId(this.id()!), categorias: of(categorias) }) : of(null);
        }),
        finalize(() => this.carregando.set(false)),
      )
      .subscribe({
        next: (resultado) => {
          if (resultado?.produto) {
            this.form.patchValue({
              nome: resultado.produto.title,
              preco: resultado.produto.price,
              descricao: resultado.produto.description,
              categoria: String(resultado.produto.category.id),
              imagem: imagemProdutoUrl(resultado.produto.images),
            });
            this.form.markAsPristine();
          }
        },
        error: () => this.erro.set('Não foi possível carregar os dados do produto.'),
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
    this.router.navigateByUrl('/produtos');
  }

  existemAlteracoesNaoSalvas(): boolean {
    return this.form.dirty;
  }
}
