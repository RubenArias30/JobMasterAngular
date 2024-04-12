import { Directive, ElementRef, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl, ValidationErrors } from '@angular/forms';

@Directive({
  selector: '[appNifValidator]',
  providers: [{ provide: NG_VALIDATORS, useExisting: NifValidatorDirective, multi: true }]
})
export class NifValidatorDirective implements Validator {
  @Input('nifType') nifType: string = '';

  constructor(private el: ElementRef) {}

  validate(control: AbstractControl): ValidationErrors | null {
    const value = control.value ? control.value.toUpperCase() : '';
    let result: boolean = false;


    const expresion_regular_dni = /^[XYZ]?\d{5,8}[A-Z]$/;

    if (value === 'ADMIN') {
      return null; // No aplicar validación para el NIF de administrador
    }


    if (expresion_regular_dni.test(value)) {
      let numero = value.substr(0, value.length - 1);
      numero = numero.replace('X', '0').replace('Y', '1').replace('Z', '2');
      const letraDni = value.substr(value.length - 1, 1);
      const letra = 'TRWAGMYFPDXBNJZSQVHLCKET';
      const calculatedLetter = letra.charAt(parseInt(numero, 10) % 23);

      if (letraDni === calculatedLetter) {
        result = true;
      }
    }

    return result ? null : { isNif: true };
  }
}
