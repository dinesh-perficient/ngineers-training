import { CommonModule } from '@angular/common';
import { Component, ChangeDetectorRef } from '@angular/core';
import type { ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

  @Component({
    selector: 'app-pie',
    standalone: true,
    imports: [CommonModule, BaseChartDirective],
    templateUrl: './pie.component.html',
    styleUrls: ['./pie.component.scss'],
  })
  export class PieComponent {
  public tooltipHovered = false;
    
  public pieChartOptions: ChartOptions<'pie'>;
    public tooltipData: any = null;
    public pieChartLabels = ['Download Sales', 'In Store Sales', 'Mail Sales'];
    public pieChartDatasets = [
      {
        data: [300, 500, 100],
      },
    ];
    public pieChartLegend = true;
    public pieChartPlugins = [];

    constructor(private cdr: ChangeDetectorRef) {
      // Use an arrow function to capture 'this' for external tooltip
      this.pieChartOptions = {
        responsive: false,
        plugins: {
          legend: {
            position: 'right',
          },
          tooltip: {
            enabled: false, // enable tooltip, but use external renderer
            external: (context: any) => {
              const tooltipModel = context.tooltip;
              if (!tooltipModel || !tooltipModel.opacity) {
                // Only hide if not hovered
                setTimeout(() => this.hideTooltip(), 100);
                return;
              }
              if (tooltipModel.dataPoints && tooltipModel.dataPoints.length > 0) {
                const data = tooltipModel.dataPoints.map((point: any) => ({
                  label: point.label,
                  value: point.formattedValue,
                }));
                this.tooltipData = {
                  title: tooltipModel.title,
                  data,
                  x: tooltipModel.caretX,
                  y: tooltipModel.caretY,
                };
                this.cdr.detectChanges();
              }
            }
          },
        },
      };
    }

    // Hide tooltip only if not hovered
    hideTooltip() {
      if (!this.tooltipHovered) {
        this.tooltipData = null;
        this.cdr.detectChanges();
      }
    }

    onTooltipButtonClick(label: string) {
      alert('Button clicked for: ' + label);
    }

    onTooltipMouseEnter() {
      this.tooltipHovered = true;
    }

    onTooltipMouseLeave() {
      this.tooltipHovered = false;
      this.tooltipData = null;
      this.cdr.detectChanges();
    }
  }