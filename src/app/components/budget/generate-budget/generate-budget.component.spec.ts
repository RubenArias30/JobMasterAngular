import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateBudgetComponent } from './generate-budget.component';

describe('GenerateBudgetComponent', () => {
  let component: GenerateBudgetComponent;
  let fixture: ComponentFixture<GenerateBudgetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GenerateBudgetComponent]
    });
    fixture = TestBed.createComponent(GenerateBudgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
