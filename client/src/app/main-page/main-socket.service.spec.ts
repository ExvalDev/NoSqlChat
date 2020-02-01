import { TestBed } from '@angular/core/testing';

import { MainSocketService } from './main-socket.service';

describe('MainSocketService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MainSocketService = TestBed.get(MainSocketService);
    expect(service).toBeTruthy();
  });
});
