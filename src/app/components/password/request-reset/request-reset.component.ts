import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-request-reset',
  templateUrl: './request-reset.component.html',
  styleUrls: ['./request-reset.component.css']
})
export class RequestResetComponent implements OnInit {

  sentMessage = false;
  resetForm: FormGroup;
  isEmptyFieldsErrorVisible = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')]],
    });
  }

  ngOnInit(): void {
    if (localStorage.getItem('token')) {
      this.router.navigate(['/']);
    }

  }

    /**
   * Function to handle form submission.
   */
  onSubmit(): void {
    if (this.resetForm.valid) {
      this.isEmptyFieldsErrorVisible = false; // Reset the message state if the form is valid
      this.apiService.sendPasswordLink(this.resetForm.value).subscribe(
        data => {
          this.sentMessage = true;

        },
        error => console.error(error)
      );
    } else {
      this.isEmptyFieldsErrorVisible = true;  // Show the message if the form is invalid
    }

  }

   /**
   * Function to navigate back to the previous page.
   */
  goBack(): void {
    this.router.navigate(['/']);
  }
}
