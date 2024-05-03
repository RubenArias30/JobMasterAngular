import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAbsencesComponent } from './add-absences.component';

describe('AddAbsencesComponent', () => {
  let component: AddAbsencesComponent;
  let fixture: ComponentFixture<AddAbsencesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddAbsencesComponent]
    });
    fixture = TestBed.createComponent(AddAbsencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
