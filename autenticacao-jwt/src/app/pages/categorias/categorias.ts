import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize, startWith } from 'rxjs';

import { ConfirmacaoModal } from '../../components/confirmacao-modal/confirmacao-modal';
import { CategoryService } from '../../core/services/category.service';
import { Category } from '../../models/category';
import { imagemCategoriaUrl } from '../../shared/image-url';
import { Loading } from '../../shared/loading/loading';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, Loading, ConfirmacaoModal],
  templateUrl: './categorias.html',
  styleUrl: './categorias.css',
})
export class Categorias implements OnInit {
  private readonly fb = inject(FormBuilder);

  readonly carregando = signal(true);
  readonly erro = signal('');
  readonly sucesso = signal('');
  readonly categorias = signal<Category[]>([]);
  readonly modalAberto = signal(false);

  readonly filtros = this.fb.nonNullable.group({
    nome: [''],
  });

  private readonly filtroAtual = toSignal(this.filtros.valueChanges.pipe(startWith(this.filtros.getRawValue())), {
    initialValue: this.filtros.getRawValue(),
  });

  readonly categoriasFiltradas = computed(() => {
    const nome = (this.filtroAtual().nome ?? '').toLowerCase().trim();
    return this.categorias().filter((categoria) => categoria.name.toLowerCase().includes(nome));
  });

  constructor(
    private readonly categoryService: CategoryService,
  ) {}

  ngOnInit(): void {
    this.categoryService
      .listar()
      .pipe(finalize(() => this.carregando.set(false)))
      .subscribe({
        next: (categorias) => this.categorias.set(categorias),
        error: () => this.erro.set('Não foi possível carregar as categorias.'),
      });
  }

  abrirExclusao(): void {
    this.modalAberto.set(true);
  }

  confirmarExclusao(): void {
    this.modalAberto.set(false);
    this.sucesso.set('Simulação de exclusão realizada.');
  }

  imagemCategoria(categoria: Category): string {
    return imagemCategoriaUrl(categoria.image);
  }
}
