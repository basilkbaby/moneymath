import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryTakeHomeCalculatorComponent } from './salary-take-home-calculator.component';

describe('SalaryTakeHomeCalculatorComponent', () => {
  let component: SalaryTakeHomeCalculatorComponent;
  let fixture: ComponentFixture<SalaryTakeHomeCalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalaryTakeHomeCalculatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalaryTakeHomeCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
