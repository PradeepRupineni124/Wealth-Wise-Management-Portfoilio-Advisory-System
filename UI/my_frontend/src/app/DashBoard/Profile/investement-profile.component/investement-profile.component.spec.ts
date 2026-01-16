import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestementProfileComponent } from './investement-profile.component';

describe('InvestementProfileComponent', () => {
  let component: InvestementProfileComponent;
  let fixture: ComponentFixture<InvestementProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvestementProfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvestementProfileComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
