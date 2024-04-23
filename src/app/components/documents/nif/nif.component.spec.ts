import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NifComponent } from './nif.component';

describe('NifComponent', () => {
  let component: NifComponent;
  let fixture: ComponentFixture<NifComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NifComponent]
    });
    fixture = TestBed.createComponent(NifComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
