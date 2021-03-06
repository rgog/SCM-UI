import { Component, OnInit } from '@angular/core';
import { multi } from './data';

@Component({
  selector: 'app-pollution-trend-graph',
  templateUrl: './pollution-trend-graph.component.html',
  styleUrls: ['./pollution-trend-graph.component.css']
})
export class PollutionTrendGraphComponent implements OnInit {
  multi: any[];
  view: any[] = [700, 300];

  // options
  legend: boolean = true;
  showLabels: boolean = true;
  animations: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showXAxisLabel: boolean = true;
  xAxisLabel: string = 'Hours';
  yAxisLabel: string = 'Pollution';
  timeline: boolean = true;

  colorScheme = {
    domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
  };

  constructor() { 
    Object.assign(this, { multi });
  }

  ngOnInit() {
  }
  

  onSelect(data): void {
  }

  onActivate(data): void {
  }

  onDeactivate(data): void {
  }

}
