import { CurrencyPipe, SlicePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize, forkJoin, startWith } from 'rxjs';

import { ConfirmacaoModal } from '../../components/confirmacao-modal/confirmacao-modal';
import { CategoryService } from '../../core/services/category.service';
import { ProductService } from '../../core/services/product.service';
import { Category } from '../../models/category';
import { Product } from '../../models/product';
import { imagemProdutoUrl } from '../../shared/image-url';
import { Loading } from '../../shared/loading/loading';

@Component({
  selector: 'app-produtos',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CurrencyPipe, SlicePipe, Loading, ConfirmacaoModal],
  templateUrl: './produtos.html',
  styleUrl: './produtos.css',
})
export class Produtos implements OnInit {
  private readonly fb = inject(FormBuilder);

  readonly carregando = signal(true);
  readonly erro = signal('');
  readonly sucesso = signal('');
  readonly produtos = signal<Product[]>([]);
  readonly categorias = signal<Category[]>([]);
  readonly produtoSelecionado = signal<Product | null>(null);
  readonly produtoDetalhe = signal<Product | null>(null);
  readonly modalAberto = signal(false);
  readonly detalheAberto = signal(false);

  readonly filtros = this.fb.nonNullable.group({
    nome: [''],
    categoria: [''],
    precoMinimo: [''],
    precoMaximo: [''],
  });

  private readonly filtroAtual = toSignal(this.filtros.valueChanges.pipe(startWith(this.filtros.getRawValue())), {
    initialValue: this.filtros.getRawValue(),
  });

  readonly produtosFiltrados = computed(() => {
    const filtros = this.filtroAtual();
    const nome = (filtros.nome ?? '').toLowerCase().trim();
    const categoria = filtros.categoria ?? '';
    const precoMinimo = Number(filtros.precoMinimo);
    const precoMaximo = Number(filtros.precoMaximo);

    return this.produtos().filter((produto) => {
      const confereNome = produto.title.toLowerCase().includes(nome);
      const confereCategoria = !categoria || String(produto.category?.id) === categoria;
      const confereMinimo = !filtros.precoMinimo || produto.price >= precoMinimo;
      const confereMaximo = !filtros.precoMaximo || produto.price <= precoMaximo;

      return confereNome && confereCategoria && confereMinimo && confereMaximo;
    });
  });

  constructor(
    private readonly productService: ProductService,
    private readonly categoryService: CategoryService,
  ) {}

  ngOnInit(): void {
    forkJoin({
      produtos: this.productService.listar(),
      categorias: this.categoryService.listar(),
    })
      .pipe(finalize(() => this.carregando.set(false)))
      .subscribe({
        next: ({ produtos, categorias }) => {
          this.produtos.set(produtos);
          this.categorias.set(categorias);
        },
        error: () => this.erro.set('Não foi possível carregar os produtos.'),
      });
  }

  abrirExclusao(produto: Product): void {
    this.produtoSelecionado.set(produto);
    this.modalAberto.set(true);
  }

  abrirDetalhe(produto: Product): void {
    this.produtoDetalhe.set(produto);
    this.detalheAberto.set(true);
  }

  fecharDetalhe(): void {
    this.detalheAberto.set(false);
    this.produtoDetalhe.set(null);
  }

  confirmarExclusao(): void {
    this.modalAberto.set(false);
    this.sucesso.set('Simulação de exclusão realizada.');
  }

  imagemProduto(produto: Product): string {
    return imagemProdutoUrl(produto.images);
  }
}
