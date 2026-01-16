import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValueAtRiskComponent } from './value-at-risk.component';

describe('ValueAtRiskComponent', () => {
  let component: ValueAtRiskComponent;
  let fixture: ComponentFixture<ValueAtRiskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValueAtRiskComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValueAtRiskComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
