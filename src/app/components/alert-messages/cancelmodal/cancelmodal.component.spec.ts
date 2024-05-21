import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelmodalComponent } from './cancelmodal.component';

describe('CancelmodalComponent', () => {
  let component: CancelmodalComponent;
  let fixture: ComponentFixture<CancelmodalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CancelmodalComponent]
    });
    fixture = TestBed.createComponent(CancelmodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
