// Import necessary Angular modules and Chart.js
import { Component, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core'; // Angular core features
import { CommonModule } from '@angular/common'; // For structural directives like *ngIf, *ngFor
import Chart from 'chart.js/auto'; // Chart.js library for chart rendering

@Component({
  selector: 'app-only-chart-js-pie', // Component selector for usage in templates
  imports: [CommonModule], // Import CommonModule for Angular template features
  templateUrl: './only-chart-js-pie.component.html', // HTML template file
  styleUrl: './only-chart-js-pie.component.scss' // SCSS style file
})
export class OnlyChartJsPieComponent implements AfterViewInit {
  // ViewChild gets a reference to the canvas element in the template
  // This is more efficient than querying the DOM manually
  @ViewChild('pieChartCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  // Tracks whether the tooltip is currently hovered by the mouse
  tooltipHovered = false;


  // Stores the data and position for the external tooltip
  // If null, tooltip is hidden
  tooltipData: {
    title: string[];
    data: { label: string; value: string }[];
    x: number;
    y: number;
  } | null = null;

  // Holds the Chart.js instance for later reference
  chart!: Chart;

  // Pie chart labels (categories) and datasets (values)
  // Marked readonly for performance and clarity
  readonly pieChartLabels = ['Download Sales', 'In Store Sales', 'Mail Sales'];
  readonly pieChartDatasets = [{ data: [300, 500, 100] }];

  // Secondary dataset for extra tooltip rows (not shown in chart)
  readonly extraTooltipRows = [
    { label: 'Total Sales', value: '900' },
    { label: 'Region', value: 'Global' },
    { label: 'Year', value: '2025' }
  ];

  // Injects Angular's ChangeDetectorRef for manual change detection
  constructor(private cdr: ChangeDetectorRef) {}

  // Angular lifecycle hook: called after the view (template) is initialized
  ngAfterViewInit() {
    // Get the canvas element from the template using ViewChild
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) return; // If not found, exit

    // Create a new Chart.js pie chart instance
    this.chart = new Chart(canvas, {
      type: 'pie', // Chart type
      data: {
        labels: this.pieChartLabels, // Chart labels
        datasets: this.pieChartDatasets, // Chart data
      },
      options: {
        responsive: false, // Disable responsiveness for fixed position
        plugins: {
          legend: { position: 'right' }, // Show legend on the right
          tooltip: {
            enabled: false, // Disable built-in Chart.js tooltip
            // Use custom external tooltip handler
            external: (context: any) => this.handleExternalTooltip(context),
          },
        },
      },
    });
  }

  /**
   * Custom external tooltip handler for Chart.js
   * Called whenever the chart wants to show/hide/update the tooltip
   * @param context Chart.js tooltip context
   */
  private handleExternalTooltip(context: any) {
    // Get the tooltip model from Chart.js
    const tooltipModel = context.tooltip;

    // If tooltip should be hidden (opacity 0), schedule hiding
    if (!tooltipModel || !tooltipModel.opacity) {
      if (this.tooltipData) {
        // Use setTimeout to allow mouse events to finish before hiding
        setTimeout(() => this.hideTooltip(), 100);
      }
      return;
    }

    // If there are data points to show in the tooltip
    if (tooltipModel.dataPoints?.length) {
      // Map Chart.js data points to our tooltip format
      const chartDataRows = tooltipModel.dataPoints.map((point: any) => ({
        label: point.label, // Label for each segment
        value: point.formattedValue, // Value for each segment
      }));

      // Merge chart data rows with extra tooltip rows
      const data = [...chartDataRows, ...this.extraTooltipRows];

      // Only update tooltip if position has changed (prevents unnecessary change detection)
      if (
        !this.tooltipData ||
        this.tooltipData.x !== tooltipModel.caretX ||
        this.tooltipData.y !== tooltipModel.caretY
      ) {
        // Set tooltip data for template rendering
        this.tooltipData = {
          title: tooltipModel.title, // Tooltip title
          data, // Tooltip data rows (chart + extra)
          x: tooltipModel.caretX, // X position (pixels)
          y: tooltipModel.caretY, // Y position (pixels)
        };
        // Manually trigger Angular change detection to update the view
        this.cdr.detectChanges();
      }
    }
  }

  /**
   * Hides the external tooltip if not hovered
   * Called by Chart.js or mouse leave events
   */
  hideTooltip() {
    // Only hide if mouse is not over the tooltip and tooltip is visible
    if (!this.tooltipHovered && this.tooltipData) {
      this.tooltipData = null; // Remove tooltip data
      this.cdr.detectChanges(); // Update the view
    }
  }

  /**
   * Handles button click inside the tooltip
   * @param label The label of the clicked segment
   */
  onTooltipButtonClick(label: string) {
    // For demo: show an alert. In real apps, use a non-blocking notification or custom logic
    alert('Button clicked for: ' + label);
  }

  /**
   * Called when mouse enters the tooltip (prevents hiding)
   */
  onTooltipMouseEnter() {
    this.tooltipHovered = true;
  }

  /**
   * Called when mouse leaves the tooltip (allows hiding)
   */
  onTooltipMouseLeave() {
    this.tooltipHovered = false;
    this.hideTooltip(); // Hide tooltip if needed
  }
}
