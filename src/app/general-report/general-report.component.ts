import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-general-report',
  templateUrl: './general-report.component.html',
  styleUrl: './general-report.component.css'
})
export class GeneralReportComponent implements OnInit{
  totalAlertsGeneral: number = 0;
  averageTimeBadPosture: number = 0;

  ngOnInit() {
    this.getTotalAlertsGeneral()
    this.getAverageTimeBadPosture()
  }

  getTotalAlertsGeneral (): number {
    return this.totalAlertsGeneral;
  }

  getAverageTimeBadPosture (): number {
    return this.averageTimeBadPosture;
  }
}
