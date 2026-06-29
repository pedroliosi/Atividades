import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirmacao-modal',
  standalone: true,
  templateUrl: './confirmacao-modal.html',
  styleUrl: './confirmacao-modal.css',
})
export class ConfirmacaoModal {
  @Input() aberto = false;
  @Input() mensagem = 'Deseja realmente excluir este registro?';

  @Output() cancelar = new EventEmitter<void>();
  @Output() confirmar = new EventEmitter<void>();
}
