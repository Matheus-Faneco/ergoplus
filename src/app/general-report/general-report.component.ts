import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-general-report',
  templateUrl: './general-report.component.html',
  styleUrl: './general-report.component.css'
})
export class GeneralReportComponent implements OnInit{
  totalAlertsGeneral: number = 0;
  averageTime: number = 0;


  ngOnInit() {
    this.getTotalAlertsGeneral()
    this.getAverageTime()
  }

  getTotalAlertsGeneral (): number {
    return this.totalAlertsGeneral;
  }

  getAverageTime(): number{
    return this.averageTime;
  }


}
