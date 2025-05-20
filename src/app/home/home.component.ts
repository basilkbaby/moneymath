import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  constructor(private title: Title, private meta: Meta) {}

  ngOnInit(): void {
    this.title.setTitle('MoneyMath | Financial Calculators for the UK');
    this.meta.addTags([
      { name: 'description', content: 'Discover financial calculators tailored for the UK. From Stamp Duty to Salary Take-Home Pay, simplify your finances with MoneyMath.' },
      { name: 'keywords', content: 'financial calculators, stamp duty, salary take-home pay, UK tax' },
    ]);
  }
}
