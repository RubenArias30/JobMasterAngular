import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBudgetComponent } from './edit-budget.component';

describe('EditBudgetComponent', () => {
  let component: EditBudgetComponent;
  let fixture: ComponentFixture<EditBudgetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditBudgetComponent]
    });
    fixture = TestBed.createComponent(EditBudgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
