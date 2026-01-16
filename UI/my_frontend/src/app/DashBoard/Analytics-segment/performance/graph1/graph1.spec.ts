import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Graph1 } from './graph1';

describe('Graph1', () => {
  let component: Graph1;
  let fixture: ComponentFixture<Graph1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Graph1]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Graph1);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
