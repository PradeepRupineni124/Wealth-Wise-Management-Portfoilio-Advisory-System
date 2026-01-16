import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabFilterComponent } from './tab-filter.component';

describe('TabFilterComponent', () => {
  let component: TabFilterComponent;
  let fixture: ComponentFixture<TabFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabFilterComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
