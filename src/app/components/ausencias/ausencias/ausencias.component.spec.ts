import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AusenciasComponent } from './ausencias.component';

describe('AusenciasComponent', () => {
  let component: AusenciasComponent;
  let fixture: ComponentFixture<AusenciasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AusenciasComponent]
    });
    fixture = TestBed.createComponent(AusenciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
