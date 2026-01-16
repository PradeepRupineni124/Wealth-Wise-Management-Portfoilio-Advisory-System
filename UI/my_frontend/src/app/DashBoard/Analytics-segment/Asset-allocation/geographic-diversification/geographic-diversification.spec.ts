import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeographicDiversification } from './geographic-diversification';

describe('GeographicDiversification', () => {
  let component: GeographicDiversification;
  let fixture: ComponentFixture<GeographicDiversification>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeographicDiversification]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeographicDiversification);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
