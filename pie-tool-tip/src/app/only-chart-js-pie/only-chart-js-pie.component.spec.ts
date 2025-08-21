import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlyChartJsPieComponent } from './only-chart-js-pie.component';

describe('OnlyChartJsPieComponent', () => {
  let component: OnlyChartJsPieComponent;
  let fixture: ComponentFixture<OnlyChartJsPieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OnlyChartJsPieComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnlyChartJsPieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
