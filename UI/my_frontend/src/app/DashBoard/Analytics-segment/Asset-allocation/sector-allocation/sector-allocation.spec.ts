import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectorAllocation } from './sector-allocation';

describe('SectorAllocation', () => {
  let component: SectorAllocation;
  let fixture: ComponentFixture<SectorAllocation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectorAllocation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SectorAllocation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
