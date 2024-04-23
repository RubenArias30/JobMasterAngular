import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaboralLifeComponent } from './laboral-life.component';

describe('LaboralLifeComponent', () => {
  let component: LaboralLifeComponent;
  let fixture: ComponentFixture<LaboralLifeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LaboralLifeComponent]
    });
    fixture = TestBed.createComponent(LaboralLifeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
