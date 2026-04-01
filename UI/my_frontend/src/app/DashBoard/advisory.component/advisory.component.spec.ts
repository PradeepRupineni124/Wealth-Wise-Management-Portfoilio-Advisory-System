import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvisoryComponent } from './advisory.component';

describe('AdvisoryComponent', () => {
  let component: AdvisoryComponent;
  let fixture: ComponentFixture<AdvisoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdvisoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvisoryComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
