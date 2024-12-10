import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Chart} from 'chart.js';

@Component({
  selector: 'app-individual-report',
  templateUrl: './individual-report.component.html',
  styleUrl: './individual-report.component.css'
})
export class IndividualReportComponent implements OnInit {
  currentPosture: string = "Correto";
  alertNumber: number = 0
  totalTimeBadPosture: number = 0;
  @ViewChild("canvas", { static: true }) element?: ElementRef;
  ngOnInit() {
    // Métodos de exemplo para depois implementar resultados que vierem da API
    this.getAlertNumber()
    this.getCurrentPosture()
    this.getTotalTimeBadPosture()
    new Chart(this.element?.nativeElement, {
      type: 'line',
      data: {
        labels: ["janeiro", "fevereiro", "março"],
        datasets: [
          {
            data: [20,30,40]
          }
        ]
      }
    });
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
}
