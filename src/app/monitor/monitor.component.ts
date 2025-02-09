// import { Component} from '@angular/core';
// import {MatCard} from '@angular/material/card';
//
// @Component({
//   selector: 'app-monitor',
//   templateUrl: './monitor.component.html',
//   standalone: true,
//   imports: [
//     MatCard
//   ],
//   styleUrl: './monitor.component.css'
// })
// export class MonitorComponent {
//
//   async startCamera(cameraNumber: number) {
//     try {
//       const devices = await navigator.mediaDevices.enumerateDevices();
//       const videoDevices = devices.filter(device => device.kind === 'videoinput');
//
//       console.log("Dispositivos de vídeo encontrados:", videoDevices);
//
//       let stream: MediaStream | null = null;
//
//       if (cameraNumber === 1) {
//         stream = await navigator.mediaDevices.getUserMedia({
//           video: { deviceId: videoDevices[0].deviceId }
//         });
//
//         const videoElement1 = document.getElementById('camera-preview-1') as HTMLVideoElement;
//         if (videoElement1.srcObject !== stream) {
//           videoElement1.srcObject = stream;
//           videoElement1.play();
//         }
//
//       } else if (cameraNumber === 2) {
//         stream = await navigator.mediaDevices.getUserMedia({
//           video: { deviceId: videoDevices[1].deviceId }
//         });
//
//         const videoElement2 = document.getElementById('camera-preview-2') as HTMLVideoElement;
//         if (videoElement2.srcObject !== stream) {
//           videoElement2.srcObject = stream;
//           videoElement2.play();
//         }
//       }
//
//     } catch (error) {
//       console.error("Erro ao acessar as câmeras:", error);
//     }
//   }
//
//
//
//
//
// }
import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import * as tf from '@tensorflow/tfjs-core';
import * as poseDetection from '@tensorflow-models/pose-detection';
import {MatCard} from '@angular/material/card';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-monitor',
  templateUrl: './monitor.component.html',
  standalone: true,
  imports: [
    MatCard,
    MatButton
  ],
  styleUrl: './monitor.component.css'
})
export class MonitorComponent implements OnInit, OnDestroy {
  @ViewChild('videoElement1') videoElement1!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement1') canvasElement1!: ElementRef<HTMLCanvasElement>;

  @ViewChild('videoElement2') videoElement2!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement2') canvasElement2!: ElementRef<HTMLCanvasElement>;

  private detector!: poseDetection.PoseDetector;
  private animationFrameId1!: number;
  private animationFrameId2!: number;
  public isDetecting = false;

  async ngOnInit() {
    await tf.ready(); // Aguarda o TensorFlow.js estar pronto
    await this.loadModel();
  }

  private async loadModel() {
    try {
      this.detector = await poseDetection.createDetector(
        poseDetection.SupportedModels.MoveNet,
        { modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING }
      );
      console.log('Modelo carregado com sucesso!');
    } catch (error) {
      console.error('Erro ao carregar o modelo:', error);
      throw error;
    }
  }

  async startDetection() {
    if (!this.isDetecting) {
      this.isDetecting = true;
      await this.setupCameras();
      this.detectFrame1();
      this.detectFrame2();
    }
  }

  stopDetection() {
    this.isDetecting = false;
    cancelAnimationFrame(this.animationFrameId1);
    cancelAnimationFrame(this.animationFrameId2);

    // Parar as câmeras
    this.stopCamera(this.videoElement1.nativeElement);
    this.stopCamera(this.videoElement2.nativeElement);
  }

  async setupCameras() {
    try {
      // Obter todos os dispositivos de mídia
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');

      // Verifique se temos pelo menos duas câmeras
      if (videoDevices.length < 2) {
        console.error("É necessário pelo menos duas câmeras!");
        return;
      }

      const video1 = this.videoElement1.nativeElement;
      const video2 = this.videoElement2.nativeElement;

      // Obtenha o stream para a primeira câmera
      const stream1 = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: { exact: videoDevices[0].deviceId } }
      });
      video1.srcObject = stream1;

      // Obtenha o stream para a segunda câmera
      const stream2 = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: { exact: videoDevices[1].deviceId } }
      });
      video2.srcObject = stream2;

      // Configure os canvases de acordo com o tamanho do vídeo
      video1.onloadedmetadata = () => {
        video1.play();
        this.canvasElement1.nativeElement.width = video1.videoWidth;
        this.canvasElement1.nativeElement.height = video1.videoHeight;
      };

      video2.onloadedmetadata = () => {
        video2.play();
        this.canvasElement2.nativeElement.width = video2.videoWidth;
        this.canvasElement2.nativeElement.height = video2.videoHeight;
      };

    } catch (error) {
      console.error("Erro ao acessar as câmeras:", error);
      throw error;
    }
  }


  private stopCamera(video: HTMLVideoElement) {
    const stream = video.srcObject as MediaStream;
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  }

  private async detectFrame1() {
    if (!this.isDetecting || !this.detector) return;

    try {
      const video1 = this.videoElement1.nativeElement;
      const poses1 = await this.detector.estimatePoses(video1);
      this.drawKeypoints(poses1, this.canvasElement1.nativeElement);
    } catch (error) {
    }

    this.animationFrameId1 = requestAnimationFrame(() => this.detectFrame1());
  }

  private async detectFrame2() {
    if (!this.isDetecting || !this.detector) return;

    try {
      const video2 = this.videoElement2.nativeElement;
      const poses2 = await this.detector.estimatePoses(video2);

      // Verifique se o resultado da detecção não é nulo
      if (poses2 && poses2.length > 0) {
        this.drawKeypoints(poses2, this.canvasElement2.nativeElement);
      } else {

      }
    } catch (error) {

    }

    this.animationFrameId2 = requestAnimationFrame(() => this.detectFrame2());
  }

  private drawKeypoints(poses: poseDetection.Pose[], canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d')!;

    // Limpar o canvas antes de desenhar os novos keypoints
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (poses.length > 0) {
      const keypoints = poses[0].keypoints;

      keypoints.forEach(keypoint => {
        if (keypoint.score! > 0.3) {
          ctx.beginPath();
          ctx.arc(keypoint.x, keypoint.y, 5, 0, 2 * Math.PI);
          ctx.fillStyle = 'red';
          ctx.fill();
        }
      });
    }
  }

  ngOnDestroy() {
    this.stopDetection();
    if (this.detector) {
      this.detector.dispose();
    }
  }
}
