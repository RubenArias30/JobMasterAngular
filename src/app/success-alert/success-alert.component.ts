import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-success-alert',
  template: `
    <div *ngIf="show" class="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400 transition-opacity duration-300 ease-out" role="alert">
      <span class="font-medium">{{ message }}</span>
    </div>
  `,
})
export class SuccessAlertComponent implements OnInit {
  @Input() show: boolean = false;
  @Input() message: string = 'Success alert!';

  ngOnInit() {
    // Automatically hide the alert after 3 seconds
    setTimeout(() => {
      this.show = false;
    }, 3000);
  }
}
