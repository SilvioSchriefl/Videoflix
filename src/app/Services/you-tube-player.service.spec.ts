import { TestBed } from '@angular/core/testing';

import { YouTubePlayerService } from './you-tube-player.service';

describe('YouTubePlayerService', () => {
  let service: YouTubePlayerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(YouTubePlayerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
