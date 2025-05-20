import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StampDutyCalculatorComponent } from './stamp-duty-calculator/stamp-duty-calculator.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'stamp-duty-calculator', component: StampDutyCalculatorComponent },
  // Add future calculators here
  { path: '**', redirectTo: '' }, // Redirect unknown routes to home
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
