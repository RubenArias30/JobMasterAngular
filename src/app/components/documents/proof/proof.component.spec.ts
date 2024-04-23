import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProofComponent } from './proof.component';

describe('ProofComponent', () => {
  let component: ProofComponent;
  let fixture: ComponentFixture<ProofComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProofComponent]
    });
    fixture = TestBed.createComponent(ProofComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
