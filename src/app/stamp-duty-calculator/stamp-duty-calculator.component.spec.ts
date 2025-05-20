import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StampDutyCalculatorComponent } from './stamp-duty-calculator.component';

describe('StampDutyCalculatorComponent', () => {
  let component: StampDutyCalculatorComponent;
  let fixture: ComponentFixture<StampDutyCalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StampDutyCalculatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StampDutyCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
