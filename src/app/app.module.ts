import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './home/home.component';
import { StampDutyCalculatorComponent } from './stamp-duty-calculator/stamp-duty-calculator.component';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { Chart, registerables } from 'chart.js';
import { MatIconModule } from '@angular/material/icon'
import { HeaderComponent } from './base/header/header.component';
import { FooterComponent } from './base/footer/footer.component';

Chart.register(...registerables);

@NgModule({
  declarations: [
    AppComponent, // Root component
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    StampDutyCalculatorComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    FormsModule,
    MatIconModule,
    BrowserAnimationsModule,
    BaseChartDirective,
    
  ],
  providers: [provideHttpClient(),
    
    provideCharts(withDefaultRegisterables())
  ],
  bootstrap: [AppComponent], // Bootstrap starts with AppComponent
})
export class AppModule {}
