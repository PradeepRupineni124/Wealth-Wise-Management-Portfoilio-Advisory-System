import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllocationBreakdown } from './allocation-breakdown';

describe('AllocationBreakdown', () => {
  let component: AllocationBreakdown;
  let fixture: ComponentFixture<AllocationBreakdown>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllocationBreakdown]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllocationBreakdown);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
