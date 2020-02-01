import { TestBed } from '@angular/core/testing';

import { EntrySocketService } from './entry-socket.service';

describe('EntrySocketService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EntrySocketService = TestBed.get(EntrySocketService);
    expect(service).toBeTruthy();
  });
});
