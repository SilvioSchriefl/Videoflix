import { TestBed } from '@angular/core/testing';

import { InerceptorService } from './inerceptor.service';

describe('InerceptorService', () => {
  let service: InerceptorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InerceptorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
