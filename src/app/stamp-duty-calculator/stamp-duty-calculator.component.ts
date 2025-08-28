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
  effectiveRate: number | null = null;
  breakdown: { label: string; amount: number }[] = [];
  calculationExplanation: string = '';
  showExplanation: boolean = false;
  activeInfoTab: string = 'first-time';
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
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
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            const value = context.raw as number;
            return `${label}: £${value.toLocaleString('en-GB', {minimumFractionDigits: 2})}`;
          }
        }
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

  calculateStampDuty(): void {
    this.breakdown = [];
    this.calculationExplanation = '';
    const chartData: number[] = [];
    const chartLabels: string[] = [];
    let duty = 0;
    const price = this.propertyPrice;

    if (this.buyerType === 'first-time') {
      if (price <= 300000) {
        duty = 0;
        this.breakdown.push({ label: '£0 - £300,000 @ 0%', amount: 0 });
        chartLabels.push('£0-£300k');
        chartData.push(0);
        this.calculationExplanation = `As a first-time buyer purchasing a property for £${price.toLocaleString('en-GB')}, you pay no Stamp Duty because the price is below £300,000.`;
      } 
      else if (price <= 500000) {
        const taxableAmount = price - 300000;
        duty = taxableAmount * 0.05;
        
        this.breakdown.push({ label: '£0 - £300,000 @ 0%', amount: 0 });
        chartLabels.push('£0-£300k');
        chartData.push(0);
        
        this.breakdown.push({ 
          label: `£300,001 - £${price.toLocaleString('en-GB')} @ 5%`, 
          amount: duty 
        });
        chartLabels.push(`£300k-£${price.toLocaleString('en-GB')}`);
        chartData.push(duty);
        
        this.calculationExplanation = `As a first-time buyer purchasing a property for £${price.toLocaleString('en-GB')}:<br>
        - £0-£300,000 @ 0% = £0<br>
        - £300,001-£${price.toLocaleString('en-GB')} @ 5% = £${duty.toLocaleString('en-GB', {minimumFractionDigits: 2})}<br>
        Total Stamp Duty = £${duty.toLocaleString('en-GB', {minimumFractionDigits: 2})}`;
      } 
      else {
        // First-time buyers purchasing above £500k pay standard rates
        const bands = [
          { threshold: 0, limit: 125000, rate: 0 },
          { threshold: 125000, limit: 125000, rate: 0.02 },
          { threshold: 250000, limit: 675000, rate: 0.05 },
          { threshold: 925000, limit: 575000, rate: 0.10 },
          { threshold: 1500000, limit: Infinity, rate: 0.12 }
        ];

        let remaining = price;
        let explanationParts = [`As a first-time buyer purchasing a property for £${price.toLocaleString('en-GB')} (over £500,000), you pay standard rates:`];
        
        for (const band of bands) {
          const taxable = Math.min(band.limit, remaining);
          if (taxable > 0) {
            const bandDuty = taxable * band.rate;
            duty += bandDuty;
            const upperLimit = band.threshold + band.limit;
            const label = upperLimit === Infinity 
              ? `Over £${band.threshold.toLocaleString('en-GB')} @ ${band.rate * 100}%`
              : `£${(band.threshold + 1).toLocaleString('en-GB')} - £${upperLimit.toLocaleString('en-GB')} @ ${band.rate * 100}%`;
            
            this.breakdown.push({ label, amount: bandDuty });
            chartLabels.push(label);
            chartData.push(bandDuty);
            remaining -= taxable;
            
            explanationParts.push(`- ${label} = £${bandDuty.toLocaleString('en-GB', {minimumFractionDigits: 2})}`);
          }
        }
        
        explanationParts.push(`Total Stamp Duty = £${duty.toLocaleString('en-GB', {minimumFractionDigits: 2})}`);
        this.calculationExplanation = explanationParts.join('<br>');
      }
    } 
    else if (this.buyerType === 'previous-owner') {
      const bands = [
        { threshold: 0, limit: 125000, rate: 0 },
        { threshold: 125000, limit: 125000, rate: 0.02 },
        { threshold: 250000, limit: 675000, rate: 0.05 },
        { threshold: 925000, limit: 575000, rate: 0.10 },
        { threshold: 1500000, limit: Infinity, rate: 0.12 }
      ];

      let remaining = price;
      let explanationParts = [`Purchasing a property for £${price.toLocaleString('en-GB')} as a previous owner:`];
      
      for (const band of bands) {
        const taxable = Math.min(band.limit, remaining);
        if (taxable > 0) {
          const bandDuty = taxable * band.rate;
          duty += bandDuty;
          const upperLimit = band.threshold + band.limit;
          const label = upperLimit === Infinity 
            ? `Over £${band.threshold.toLocaleString('en-GB')} @ ${band.rate * 100}%`
            : `£${(band.threshold + 1).toLocaleString('en-GB')} - £${upperLimit.toLocaleString('en-GB')} @ ${band.rate * 100}%`;
          
          this.breakdown.push({ label, amount: bandDuty });
          chartLabels.push(label);
          chartData.push(bandDuty);
          remaining -= taxable;
          
          explanationParts.push(`- ${label} = £${bandDuty.toLocaleString('en-GB', {minimumFractionDigits: 2})}`);
        }
      }
      
      explanationParts.push(`Total Stamp Duty = £${duty.toLocaleString('en-GB', {minimumFractionDigits: 2})}`);
      this.calculationExplanation = explanationParts.join('<br>');
    }
    else if (this.buyerType === 'additional-property') {
  // Additional property rates (standard rates + 5% surcharge)
  const bands = [
    { threshold: 0, limit: 125000, rate: 0.05 },      // 0% standard + 5% surcharge
    { threshold: 125000, limit: 125000, rate: 0.07 }, // 2% standard + 5% surcharge
    { threshold: 250000, limit: 675000, rate: 0.10 }, // 5% standard + 5% surcharge
    { threshold: 925000, limit: 575000, rate: 0.15 }, // 10% standard + 5% surcharge
    { threshold: 1500000, limit: Infinity, rate: 0.17 } // 12% standard + 5% surcharge
  ];

  let remaining = price;
  let explanationParts = [`Purchasing an additional property for £${price.toLocaleString('en-GB')}:<br>
  You pay the additional property rates (standard rates + 5% surcharge):`];
  
  for (const band of bands) {
    const taxable = Math.min(band.limit, remaining);
    if (taxable > 0) {
      const bandDuty = taxable * band.rate;
      duty += bandDuty;
      const upperLimit = band.threshold + band.limit;
      // Fixed percentage display - removes floating point imprecision
      const ratePercent = Math.round(band.rate * 100 * 100) / 100; // Rounds to 2 decimal places
      const label = upperLimit === Infinity 
        ? `Over £${band.threshold.toLocaleString('en-GB')} @ ${ratePercent}%`
        : `£${(band.threshold + 1).toLocaleString('en-GB')} - £${upperLimit.toLocaleString('en-GB')} @ ${ratePercent}%`;
      
      this.breakdown.push({ label, amount: bandDuty });
      chartLabels.push(label);
      chartData.push(bandDuty);
      remaining -= taxable;
      
      explanationParts.push(`- ${label} = £${bandDuty.toLocaleString('en-GB', {minimumFractionDigits: 2})}`);
    }
  }
  
  explanationParts.push(`Total Stamp Duty = £${duty.toLocaleString('en-GB', {minimumFractionDigits: 2})}`);
  this.calculationExplanation = explanationParts.join('<br>');
}
    else if (this.buyerType === 'company') {
      if (price > 500000) {
        duty = price * 0.15;
        this.breakdown.push({ label: 'Flat 15% (Company Purchase)', amount: duty });
        chartLabels.push('Company Purchase');
        chartData.push(duty);
        this.calculationExplanation = `As a company purchasing a residential property for £${price.toLocaleString('en-GB')} (over £500,000), you pay 15% flat rate:<br>
        - £${price.toLocaleString('en-GB')} @ 15% = £${duty.toLocaleString('en-GB', {minimumFractionDigits: 2})}`;
      } else {
        // Companies buying under £500k pay standard rates
        const bands = [
          { threshold: 0, limit: 125000, rate: 0 },
          { threshold: 125000, limit: 125000, rate: 0.02 },
          { threshold: 250000, limit: 675000, rate: 0.05 },
          { threshold: 925000, limit: 575000, rate: 0.10 },
          { threshold: 1500000, limit: Infinity, rate: 0.12 }
        ];

        let remaining = price;
        let explanationParts = [`As a company purchasing a residential property for £${price.toLocaleString('en-GB')} (under £500,000), you pay standard rates:`];
        
        for (const band of bands) {
          const taxable = Math.min(band.limit, remaining);
          if (taxable > 0) {
            const bandDuty = taxable * band.rate;
            duty += bandDuty;
            const upperLimit = band.threshold + band.limit;
            const label = upperLimit === Infinity 
              ? `Over £${band.threshold.toLocaleString('en-GB')} @ ${band.rate * 100}%`
              : `£${(band.threshold + 1).toLocaleString('en-GB')} - £${upperLimit.toLocaleString('en-GB')} @ ${band.rate * 100}%`;
            
            this.breakdown.push({ label, amount: bandDuty });
            chartLabels.push(label);
            chartData.push(bandDuty);
            remaining -= taxable;
            
            explanationParts.push(`- ${label} = £${bandDuty.toLocaleString('en-GB', {minimumFractionDigits: 2})}`);
          }
        }
        
        explanationParts.push(`Total Stamp Duty = £${duty.toLocaleString('en-GB', {minimumFractionDigits: 2})}`);
        this.calculationExplanation = explanationParts.join('<br>');
      }
    }

    this.stampDuty = +duty.toFixed(2);
    this.effectiveRate = price > 0 ? +(duty / price * 100).toFixed(2) : 0;
    this.showExplanation = true;
    
    this.barChartData = {
      labels: chartLabels,
      datasets: [{
        ...this.barChartData.datasets[0],
        data: chartData
      }]
    };
  }

  toggleExplanation(): void {
    this.showExplanation = !this.showExplanation;
  }
}