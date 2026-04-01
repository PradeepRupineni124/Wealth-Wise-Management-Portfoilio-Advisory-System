import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskAdjustedMetrics } from './risk-adjusted-metrics';

describe('RiskAdjustedMetrics', () => {
  let component: RiskAdjustedMetrics;
  let fixture: ComponentFixture<RiskAdjustedMetrics>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RiskAdjustedMetrics]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RiskAdjustedMetrics);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
