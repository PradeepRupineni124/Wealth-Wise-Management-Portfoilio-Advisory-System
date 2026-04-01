import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskAssesment } from './risk-assesment';

describe('RiskAssesment', () => {
  let component: RiskAssesment;
  let fixture: ComponentFixture<RiskAssesment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RiskAssesment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RiskAssesment);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
