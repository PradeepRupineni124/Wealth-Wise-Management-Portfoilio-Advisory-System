import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplianceComponent } from './compilance.component';

describe('CompilanceComponent', () => {
  let component: ComplianceComponent;
  let fixture: ComponentFixture<ComplianceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComplianceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComplianceComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
