import { Directive, ElementRef, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl, ValidationErrors } from '@angular/forms';

@Directive({
  selector: '[appNifValidator]',
  providers: [{ provide: NG_VALIDATORS, useExisting: NifValidatorDirective, multi: true }]
})
export class NifValidatorDirective implements Validator {
   // Input property to specify the type of NIF
  @Input('nifType') nifType: string = '';

  constructor(private el: ElementRef) {}
  // Validation method implementing the Validator interface
  validate(control: AbstractControl): ValidationErrors | null {
     // Get the control value and convert it to uppercase
    const value = control.value ? control.value.toUpperCase() : '';
    let result: boolean = false;

    // Regular expression to validate the format of DNI
    const expresion_regular_dni = /^[XYZ]?\d{5,8}[A-Z]$/;

    // Exception for admin NIF, which doesn't require validation
    if (value === 'ADMIN') {
      return null; // Do not apply validation for admin NIF
    }


    // Check if the value matches the regular expression
    if (expresion_regular_dni.test(value)) {
      // Extract the number part of the NIF and adapt if it starts with X, Y, or Z
      let numero = value.substr(0, value.length - 1);
      numero = numero.replace('X', '0').replace('Y', '1').replace('Z', '2');
      // Extract the letter part of the NIF
      const letraDni = value.substr(value.length - 1, 1);
       // String with valid NIF control letters
      const letra = 'TRWAGMYFPDXBNJZSQVHLCKET';
      // Calculate the control letter from the number
      const calculatedLetter = letra.charAt(parseInt(numero, 10) % 23);

      // Verify if the NIF letter matches the calculated one
      if (letraDni === calculatedLetter) {
        result = true;
      }
    }

    // Return null if validation is successful, or an error object if it is not
    return result ? null : { isNif: true };
  }
}
