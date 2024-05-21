import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-cancelmodal',
  templateUrl: './cancelmodal.component.html',
  styleUrls: ['./cancelmodal.component.css']
})
export class CancelmodalComponent {
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm(): void {
    this.confirm.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
