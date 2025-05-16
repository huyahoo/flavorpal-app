interface BarcodeDetectorResult {
  rawValue: string;
  format: string;
}

interface BarcodeDetector {
  detect(source: MediaStream | HTMLVideoElement | HTMLImageElement | HTMLCanvasElement): Promise<BarcodeDetectorResult[]>;
}

interface BarcodeDetectorConstructor {
  new (options?: { formats?: string[] }): BarcodeDetector;
  readonly prototype: BarcodeDetector;
}

declare var BarcodeDetector: BarcodeDetectorConstructor;