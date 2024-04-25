import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api/api.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-add-documents',
  templateUrl: './add-documents.component.html',
  styleUrls: ['./add-documents.component.css']
})
export class AddDocumentsComponent {
  documentForm: FormGroup;
  employeeId: number | null = null; // Inicializa la propiedad con un valor seguro

  constructor(private apiService: ApiService, private fb: FormBuilder, private route: ActivatedRoute) {
    this.documentForm = this.fb.group({
      tipo: ['', Validators.required],
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      fecha: ['', Validators.required],
      archivo: ['', Validators.required]
    });

    // Obtén el ID del empleado de los parámetros de la ruta
    this.route.params.subscribe(params => {
      this.employeeId = params['employeeId'];
    });
  }

  addDocument(): void {
    if (this.documentForm.invalid) {
      console.log('El formulario no es válido. Por favor, completa todos los campos correctamente.');
      return;
    }

    // Agrega el ID del empleado al documento antes de enviarlo al servidor
    const documentData = { ...this.documentForm.value, employee_id: this.employeeId };

    this.apiService.addDocument(documentData).subscribe(
      (response) => {
        console.log('Documento agregado exitosamente:', response);
        // Navega a la vista de documentos o realiza otra acción si es necesario
      },
      (error) => {
        console.error('Error al agregar el documento:', error);
      }
    );
  }
}
