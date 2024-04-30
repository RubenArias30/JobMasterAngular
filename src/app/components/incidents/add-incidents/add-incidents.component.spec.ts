import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddIncidentsComponent } from './add-incidents.component';

describe('AddIncidentsComponent', () => {
  let component: AddIncidentsComponent;
  let fixture: ComponentFixture<AddIncidentsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddIncidentsComponent]
    });
    fixture = TestBed.createComponent(AddIncidentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
