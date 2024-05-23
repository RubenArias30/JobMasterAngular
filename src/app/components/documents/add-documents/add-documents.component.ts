import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api/api.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-add-documents',
  templateUrl: './add-documents.component.html',
  styleUrls: ['./add-documents.component.css']
})
export class AddDocumentsComponent implements OnInit {
  documentForm: FormGroup;
  employeeId: number | null = null;
  showMissingFieldsError: boolean = false;
  selectedFile: File | null = null;

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Initializes the document form with form controls and validators
    this.documentForm = this.fb.group({
      type_documents: ['', Validators.required],
      name: ['', Validators.required],
      description: ['', Validators.required],
      date: ['', [Validators.required, this.dateValidator()]],
      route: ['', [Validators.required, this.fileExtensionValidator]]
    });
  }

  ngOnInit(): void {
     // Retrieves the employee ID from the route parameters
    this.route.params.subscribe(params => {
      this.employeeId = params['employeeId'] ? +params['employeeId'] : null;
    });
  }

  // Method to handle file selection
  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;  // Sets the selected file
      this.documentForm.patchValue({ route: file.name }); // Updates the document route field with the file name
    }
  }

   // Method to submit the document form
  submitForm(): void {
    if (this.documentForm.invalid || !this.selectedFile) {
      this.showMissingFieldsError = true; // Shows missing fields error if the form is invalid or no file is selected
      return;
    }
    this.showMissingFieldsError = false; // Hides the missing fields error

    const formData = new FormData();
    formData.append('type_documents', this.documentForm.value.type_documents);
    formData.append('name', this.documentForm.value.name);
    formData.append('description', this.documentForm.value.description);
    formData.append('date', this.documentForm.value.date);
    formData.append('file', this.selectedFile!);

    // Calls the API service to upload the document
    this.apiService.uploadDocument(this.employeeId!, formData).subscribe(
      (response) => {
        this.router.navigate(['/documents/details', this.employeeId]);
      },
      (error) => {
        console.error('Error al agregar el documento:', error);
      }
    );
  }

 // Custom validator function to validate date range
dateValidator(): any {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    const selectedDate = new Date(control.value);
    const currentDate = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(currentDate.getFullYear() - 1);

    // Validates for future date
    if (selectedDate > currentDate) {
      return { 'invalidFutureDate': true };
    }

    // Validates for past date (more than one year ago)
    if (selectedDate < oneYearAgo) {
      return { 'invalidPastDate': true };
    }

    return null; // Returns null if date is within valid range
  };
}


  // Función de validación personalizada para la extensión de imagen
  fileExtensionValidator(control: any) {
    if (control.value) {
      const allowedExtensions = /(\.pdf|\.doc|\.docx)$/i;
      if (!allowedExtensions.test(control.value)) {
        return { invalidFileExtension: true };
      }
    }
    return null;
  }


  // cancelbutton(): void {
  //   if (confirm('¿Estás seguro de cancelar la operacion?')) {
  //     // Si el usuario confirma la cancelación, redirige a la página de administración de empleados
  //     this.router.navigate(['/documents/details', this.employeeId]);
  //   }
  // }


  openModal(): void {
    const modal = document.getElementById('popup-modal');
    if (modal) {
      modal.classList.remove('hidden');
    }
  }

  closeModal(): void {
    const modal = document.getElementById('popup-modal');
    if (modal) {
      modal.classList.add('hidden');
    }
  }

  confirmCancelEdit(): void {
    this.closeModal();
    this.router.navigate(['/documents/details', this.employeeId]);
  }
}


