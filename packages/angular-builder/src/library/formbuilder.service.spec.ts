import { TestBed } from '@angular/core/testing';

import { NgFormbuilderService } from './ng-formbuilder.service';

describe('NgFormbuilderService', () => {
  let service: NgFormbuilderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgFormbuilderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
