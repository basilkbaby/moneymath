import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StampDutyService {
  calculateStampDuty(propertyPrice: number, buyerType: string): { stampDuty: number; errorMessage: string } {
    let stampDuty = 0;
    let errorMessage = '';

    if (propertyPrice <= 0 || isNaN(propertyPrice)) {
      errorMessage = 'Please enter a valid property price greater than £0.';
      return { stampDuty, errorMessage };
    }

    // Stamp Duty Brackets
    const firstTimeBuyerBrackets = [
      { limit: 425000, rate: 0 },
      { limit: 625000, rate: 0.05 },
      { limit: Infinity, rate: 0.1 },
    ];

    const nextHomeBuyerBrackets = [
      { limit: 250000, rate: 0 },
      { limit: 925000, rate: 0.05 },
      { limit: 1500000, rate: 0.1 },
      { limit: Infinity, rate: 0.12 },
    ];

    const additionalPropertyBrackets = [
      { limit: 250000, rate: 0.03 },
      { limit: 925000, rate: 0.08 },
      { limit: 1500000, rate: 0.13 },
      { limit: Infinity, rate: 0.15 },
    ];

    // Select appropriate brackets
    let brackets = [];
    switch (buyerType) {
      case 'firstTime':
        if (propertyPrice > 625000) {
          errorMessage =
            'First-time buyer stamp duty relief is not applicable for properties above £625,000.';
          return { stampDuty, errorMessage };
        }
        brackets = firstTimeBuyerBrackets;
        break;
      case 'nextHome':
        brackets = nextHomeBuyerBrackets;
        break;
      case 'additionalProperty':
        brackets = additionalPropertyBrackets;
        break;
      default:
        errorMessage = 'Invalid buyer type selected.';
        return { stampDuty, errorMessage };
    }

    // Calculate stamp duty based on progressive tax rates
    let previousLimit = 0;
    for (const bracket of brackets) {
      if (propertyPrice > bracket.limit) {
        stampDuty += (bracket.limit - previousLimit) * bracket.rate;
        previousLimit = bracket.limit;
      } else {
        stampDuty += (propertyPrice - previousLimit) * bracket.rate;
        break;
      }
    }

    // Format stamp duty for display
    stampDuty = parseFloat(stampDuty.toFixed(2));
    return { stampDuty, errorMessage };
  }
}
