import { Component } from '@angular/core';

@Component({
  selector: 'app-monitor',
  templateUrl: './monitor.component.html',
  styleUrl: './monitor.component.css'
})
export class MonitorComponent {

  async startCamera(cameraNumber: number) {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');

      console.log("Dispositivos de vídeo encontrados:", videoDevices);

      let stream: MediaStream | null = null;

      if (cameraNumber === 1) {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: videoDevices[0].deviceId }
        });

        const videoElement1 = document.getElementById('camera-preview-1') as HTMLVideoElement;
        if (videoElement1.srcObject !== stream) {
          videoElement1.srcObject = stream;
          videoElement1.play();
        }

      } else if (cameraNumber === 2) {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: videoDevices[1].deviceId }
        });

        const videoElement2 = document.getElementById('camera-preview-2') as HTMLVideoElement;
        if (videoElement2.srcObject !== stream) {
          videoElement2.srcObject = stream;
          videoElement2.play();
        }
      }

    } catch (error) {
      console.error("Erro ao acessar as câmeras:", error);
    }
  }

}
