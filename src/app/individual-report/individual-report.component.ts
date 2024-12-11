import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-individual-report',
  templateUrl: './individual-report.component.html',
  styleUrl: './individual-report.component.css'
})
export class IndividualReportComponent implements OnInit {
  currentPosture: string = "Correto";
  alertNumber: number = 0;
  totalTimeBadPosture: number = 0;
  historyData: Array<{ date: string; duration: number }> = [];


  ngOnInit() {
    // Métodos de exemplo para depois implementar resultados que vierem da API
    this.getAlertNumber()
    this.getCurrentPosture()
    this.getTotalTimeBadPosture()
    this.loadHistoryData()
  }

  // TOTAL DE ALERTAS
  getAlertNumber(): number {
    return this.alertNumber;
  }

  getCurrentPosture(): string {
    return this.currentPosture;
  }

  getTotalTimeBadPosture(): number {
    return this.totalTimeBadPosture;
  }

  loadHistoryData() {
    this.historyData = [
      { date: '2024-12-01', duration: 15 },
      { date: '2024-12-01', duration: 23 },
      { date: '2024-12-01', duration: 12 },
      { date: '2024-12-01', duration: 2 },
    ];
  }

}
