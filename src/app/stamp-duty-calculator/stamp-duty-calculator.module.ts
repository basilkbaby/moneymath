import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StampDutyCalculatorComponent } from './stamp-duty-calculator.component';
import { BreakdownComponent } from './breakdown/breakdown.component';
import { InfoComponent } from './info/info.component';
import { RouterModule, Routes } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';

const routes: Routes = [
  { path: '', component: StampDutyCalculatorComponent }
];

@NgModule({
  declarations: [
    StampDutyCalculatorComponent,
    BreakdownComponent,
    InfoComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    MatIconModule,
    BaseChartDirective,
    // Import only the Angular Material modules you use here
  ],
  providers: [   
    provideCharts(withDefaultRegisterables())
  ],
})
export class StampDutyCalculatorModule { }