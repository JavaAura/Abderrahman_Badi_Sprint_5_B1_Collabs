import { TestBed } from '@angular/core/testing';

import { TaskPopupService } from './task-popup.service';

describe('TaskPopupService', () => {
  let service: TaskPopupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskPopupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
