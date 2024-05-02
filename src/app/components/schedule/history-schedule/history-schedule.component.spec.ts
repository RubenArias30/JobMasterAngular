import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryScheduleComponent } from './history-schedule.component';

describe('HistoryScheduleComponent', () => {
  let component: HistoryScheduleComponent;
  let fixture: ComponentFixture<HistoryScheduleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HistoryScheduleComponent]
    });
    fixture = TestBed.createComponent(HistoryScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
