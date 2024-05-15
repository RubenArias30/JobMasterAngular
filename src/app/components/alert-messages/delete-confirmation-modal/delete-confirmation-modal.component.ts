import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-delete-confirmation-modal',
  templateUrl: './delete-confirmation-modal.component.html',
  styleUrls: ['./delete-confirmation-modal.component.css']
})
export class DeleteConfirmationModalComponent {
  @Input() showConfirmationModal = false;
  @Output() closeModalEvent = new EventEmitter<void>();

  @Output() confirmDelete = new EventEmitter<void>();

  constructor() { }

  closeModal() {
    this.closeModalEvent.emit();

  }
  confirmDeletion(): void {
    this.confirmDelete.emit();



}
}
