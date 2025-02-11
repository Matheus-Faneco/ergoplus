import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import * as tf from '@tensorflow/tfjs-core';
import * as poseDetection from '@tensorflow-models/pose-detection';

declare const cv: any;

@Component({
  selector: 'app-monitor',
  templateUrl: './monitor.component.html',
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
      const src = cv.imread(video1);
      this.detectColor(src);
      src.delete();
    } catch (error) {
    }

    this.animationFrameId1 = requestAnimationFrame(() => this.detectFrame1());
  }

  private async detectFrame2() {
    if (!this.isDetecting || !this.detector) return;

    try {
      const video2 = this.videoElement2.nativeElement;
      const poses2 = await this.detector.estimatePoses(video2);

      this.drawKeypoints(poses2, this.canvasElement2.nativeElement);
      const src = cv.imread(video2);
      this.detectColor(src);  // Detecta a cor no frame atual
      src.delete();

    } catch (error) {
    }



    this.animationFrameId2 = requestAnimationFrame(() => this.detectFrame2());
  }

  private detectColor(src: any) {
    // Converte a imagem para o espaço de cor HSV
    const hsv = new cv.Mat();
    cv.cvtColor(src, hsv, cv.COLOR_BGR2HSV);

    // Limite inferior e superior para a cor que você deseja detectar (vermelho aqui como exemplo)
    const lower = new cv.Mat(hsv.rows, hsv.cols, hsv.type(), [0, 0, 200]); // Limite inferior de cor
    const upper = new cv.Mat(hsv.rows, hsv.cols, hsv.type(), [180, 60, 255]); // Limite superior de cor

    // Cria a máscara que seleciona a região de interesse (cor vermelha)
    const mask = new cv.Mat();
    cv.inRange(hsv, lower, upper, mask);

    // Verifique se a máscara foi criada corretamente
    console.log('Máscara criada:', mask.data32F.length > 0);

    // Encontrando os contornos na máscara (áreas da cor detectada)
    const contours = new cv.MatVector();
    const hierarchy = new cv.Mat();
    cv.findContours(mask, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

    // Verificando se encontramos contornos
    if (contours.size() > 0) {
      console.log(`Encontrados ${contours.size()} contornos!`);

      // Desenhando contornos na imagem original
      for (let i = 0; i < contours.size(); i++) {
        const contour = contours.get(i);
        const color = new cv.Scalar(255, 0, 0);  // Azul
        cv.drawContours(src, contours, i, color, 2, cv.LINE_8, hierarchy, 0);

        // Desenhando um retângulo em torno do contorno detectado
        const rect = cv.boundingRect(contour);
        cv.rectangle(src, rect, color, 2);
      }

      console.log("Cor detectada!");
    } else {
      console.log("Nenhuma cor detectada.");
    }

    // Liberando as matrizes temporárias
    lower.delete();
    upper.delete();
    mask.delete();
    hierarchy.delete();
  }



  private drawKeypoints(poses: poseDetection.Pose[], canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d')!;

    // Limpar o canvas antes de desenhar os novos keypoints
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (poses.length > 0) {
      const keypoints = poses[0].keypoints;

      const drawPoint = (point: any, color: string) => {
        if (point && point.score! > 0.1) {
          ctx.beginPath();
          ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
          ctx.fillStyle = color;
          ctx.fill();
        }
      };

      // Desenhando os ombros
      const shoulderLeft = keypoints.find(point => point.name === 'left_shoulder');
      const shoulderRight = keypoints.find(point => point.name === 'right_shoulder');

      drawPoint(shoulderLeft, 'blue');  // Ombro esquerdo
      drawPoint(shoulderRight, 'green'); // Ombro direito
    }
  }

  ngOnDestroy() {
    this.stopDetection();
    if (this.detector) {
      this.detector.dispose();
    }
  }
}
