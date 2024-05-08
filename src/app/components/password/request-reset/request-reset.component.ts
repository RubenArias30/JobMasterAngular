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
  isEmptyFieldsErrorVisible = false; // Nueva variable para controlar la visibilidad del mensaje

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

  onSubmit(): void {
    if (this.resetForm.valid) {
      this.isEmptyFieldsErrorVisible = false; // Reinicia el estado del mensaje si el formulario es válido
      this.apiService.sendPasswordLink(this.resetForm.value).subscribe(
        data => {
          console.log(data);
          this.sentMessage = true;

        },
        error => console.error(error)
      );
    } else {
      this.isEmptyFieldsErrorVisible = true; // Muestra el mensaje si el formulario es inválido
    }
    
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
