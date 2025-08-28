import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stamp-duty-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent {
  @Input() activeInfoTab: string = '';
}