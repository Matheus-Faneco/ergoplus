import { Component } from '@angular/core';

@Component({
  selector: 'app-monitor',
  templateUrl: './monitor.component.html',
  styleUrl: './monitor.component.css'
})
export class MonitorComponent {

  async startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true});

      const videoELement = document.getElementById('camera-preview') as HTMLVideoElement;
      videoELement.srcObject = stream;
      videoELement.play();
    } catch (error) {
      console.error("erro ao acessar a camera:", error);
    }
  }

}
