import { Component, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-stamp-duty-calculator',
  templateUrl: './stamp-duty-calculator.component.html',
  styleUrls: ['./stamp-duty-calculator.component.scss']
})
export class StampDutyCalculatorComponent {
  propertyPrice: number = 0;
  buyerType: string = 'first-time';
  stampDuty: number | null = null;
  breakdown: { label: string; amount: number }[] = [];
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  // Updated chart properties
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false, // This is crucial
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: '#e9ecef'
        },
        ticks: {
          callback: (value) => '£' + value
        }
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };

  public barChartType: ChartType = 'bar';
  
  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [
        'rgba(0, 82, 255, 0.7)',
        'rgba(0, 82, 255, 0.6)',
        'rgba(0, 82, 255, 0.5)',
        'rgba(0, 82, 255, 0.4)',
        'rgba(0, 82, 255, 0.3)'
      ],
      borderColor: [
        'rgba(0, 82, 255, 1)',
        'rgba(0, 82, 255, 1)',
        'rgba(0, 82, 255, 1)',
        'rgba(0, 82, 255, 1)',
        'rgba(0, 82, 255, 1)'
      ],
      borderWidth: 1,
      borderRadius: 4
    }]
  };

  ngOnDestroy() {
    if (this.chart) {
      this.chart.chart?.destroy();
    }
  }


  calculateStampDuty(): void {
    this.breakdown = [];
    const chartData: number[] = [];
    const chartLabels: string[] = [];
    let duty = 0;

    const price = this.propertyPrice;

    if (this.buyerType === 'company' && price > 500000) {
      // 15% flat rate for companies buying over £500k
      duty = price * 0.15;
      this.breakdown.push({ label: 'Flat 15% (Company Purchase)', amount: duty });
      chartLabels.push('Company Purchase');
      chartData.push(duty);
    } 
    else if (this.buyerType === 'first-time' && price <= 500000) {
      // First-time buyer relief (up to £500k)
      const band1 = Math.min(price, 300000);
      const band2 = Math.max(0, price - 300000);
      
      if (band1 > 0) {
        this.breakdown.push({ label: '£0 - £300,000 @ 0%', amount: 0 });
        chartLabels.push('£0-£300k');
        chartData.push(0);
      }
      
      if (band2 > 0) {
        const bandDuty = band2 * 0.05;
        duty += bandDuty;
        this.breakdown.push({ 
          label: `£300,001 - £500,000 @ 5%`, 
          amount: bandDuty 
        });
        chartLabels.push('£300k-£500k');
        chartData.push(bandDuty);
      }
    } 
    else {
      // Standard rates (or first-time buyers over £500k)
      const bands = [
        { threshold: 0, limit: 250000, rate: 0 },
        { threshold: 250000, limit: 675000, rate: 0.05 },
        { threshold: 925000, limit: 575000, rate: 0.10 },
        { threshold: 1500000, limit: Infinity, rate: 0.12 }
      ];

      let remaining = price;
      for (const band of bands) {
        const taxable = Math.min(band.limit, remaining);
        if (taxable > 0) {
          const bandDuty = taxable * band.rate;
          duty += bandDuty;
          const upperLimit = band.threshold + band.limit;
          const label = upperLimit === Infinity 
            ? `Over £${band.threshold.toLocaleString()} @ ${band.rate * 100}%`
            : `£${(band.threshold + 1).toLocaleString()} - £${upperLimit.toLocaleString()} @ ${band.rate * 100}%`;
          
          this.breakdown.push({ label, amount: bandDuty });
          chartLabels.push(label);
          chartData.push(bandDuty);
          remaining -= taxable;
        }
      }

      // Additional 3% for second homes
      if (this.buyerType === 'additional-property') {
        const surcharge = price * 0.03;
        duty += surcharge;
        this.breakdown.push({ 
          label: 'Additional Property Surcharge (3%)', 
          amount: surcharge 
        });
        chartLabels.push('3% Surcharge');
        chartData.push(surcharge);
      }
    }

    this.stampDuty = +duty.toFixed(2);
    this.barChartData = {
      labels: chartLabels,
      datasets: [{
        ...this.barChartData.datasets[0],
        data: chartData
      }]
    };
  }

  getBands(buyerType: string): { threshold: number; limit: number; rate: number }[] {
    if (buyerType === 'first-time') {
      return [
        { threshold: 0, limit: 425000, rate: 0 },         // No SDLT up to £425,000
        { threshold: 425000, limit: 200000, rate: 0.05 }, // 5% from £425,001–£625,000
        { threshold: 625000, limit: Infinity, rate: 0.05 } // Standard rates after that
      ];
    }

    return [
      { threshold: 0, limit: 250000, rate: 0 },
      { threshold: 250000, limit: 675000, rate: 0.05 },
      { threshold: 925000, limit: 575000, rate: 0.10 },
      { threshold: 1500000, limit: Infinity, rate: 0.12 }
    ];
  }
}