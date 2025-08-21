import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { OnlyChartJsPieComponent } from './only-chart-js-pie/only-chart-js-pie.component';
/* import { PieComponent } from './pie/pie.component'; */

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, OnlyChartJsPieComponent, /* PieComponent */],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'pie-tool-tip';
}
