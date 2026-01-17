import { ComponentFixture, TestBed } from '@angular/core/testing';

<<<<<<<< HEAD:UI/my_frontend/src/app/Authentication/registration.component/registration.component.spec.ts
import { Registration } from './registration.component';
========
import { LayoutComponent } from './layout.component';
>>>>>>>> da5ad1f8d02d4386e9df1c045168a5ab20f74469:UI/my_frontend/src/app/layout.component/layout.component.spec.ts

describe('LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
