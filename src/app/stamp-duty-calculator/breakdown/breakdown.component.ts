import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-breakdown',
  templateUrl: './breakdown.component.html',
  styleUrls: ['./breakdown.component.scss']
})
export class BreakdownComponent {
  @Input() breakdown: any[] = [];
}