import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInvestmentComponent } from './add-investment.component';

describe('AddInvestmentComponent', () => {
  let component: AddInvestmentComponent;
  let fixture: ComponentFixture<AddInvestmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddInvestmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddInvestmentComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
