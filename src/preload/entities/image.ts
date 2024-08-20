import { DataSet } from 'dicom-parser'

export class Image {
  private dataSet: DataSet
  private pixelData: Uint8Array | undefined
  private rows: number
  private cols: number
  private bitsAllocated: number
  private photometricInterpretation: string
  private samplesPerPixel: number
  private numberOfFrames: number // 파일 내 이미지가 몇 프레임으로 구성되어 있는지를 저장

  constructor(dataSet: DataSet) {
    this.dataSet = dataSet

    // Pixel Data 요소 초기화
    const pixelDataElement = this.dataSet.elements.x7fe00010

    if (pixelDataElement) {
      this.pixelData = new Uint8Array(
        this.dataSet.byteArray.buffer,
        pixelDataElement.dataOffset,
        pixelDataElement.length
      )
    } else {
      throw new Error('Pixel Data element not found')
    }

    // 메타데이터 초기화
    this.rows = this.dataSet.uint16('x00280010') || 0 // Rows
    this.cols = this.dataSet.uint16('x00280011') || 0 // Columns
    this.bitsAllocated = this.dataSet.uint16('x00280100') || 8 // Bits Allocated
    this.photometricInterpretation = this.dataSet.string('x00280004') || 'MONOCHROME2' // Photometric Interpretation
    this.samplesPerPixel = this.dataSet.uint16('x00280002') || 1 // Samples per Pixel
    this.numberOfFrames = parseInt(this.dataSet.string('x00280008') || '1', 10) // Number of Frames 기본값 1로 설정

    console.log('new Image 인스턴스 했어')
  }

  // frameIndex에 해당하는 프레임의 픽셀 데이터 추출, 인덱스 지정하면 특정 프레임 가져올 수 있음
  // output: 프레임의 시작위치부터 끝 위치를 계산해 해당범위 데이터 반환
  getPixelData(frameIndex: number = 0): Uint8Array | undefined {
    if (!this.pixelData) {
      return undefined
    }

    const frameSize = this.getFrameSize()
    const start = frameIndex * frameSize
    const end = start + frameSize

    return this.pixelData.slice(start, end)
  }

  // 한 프레임의 크기를 계산. 이미지 행, 열, 샘플당 픽셀 수, 비트 할당량에 의해 결정
  getFrameSize(): number {
    return this.rows * this.cols * (this.bitsAllocated / 8) * this.samplesPerPixel
  }

  getNumberOfFrames(): number {
    return this.numberOfFrames
  }

  getRows(): number {
    return this.rows
  }

  getCols(): number {
    return this.cols
  }

  getBitsAllocated(): number {
    return this.bitsAllocated
  }

  getPhotometricInterpretation(): string {
    return this.photometricInterpretation
  }

  getSamplesPerPixel(): number {
    return this.samplesPerPixel
  }

  print(): string | number {
    const results: string[] = []
    results.push(`Pixel Data: ${this.pixelData ? this.pixelData : 'Not Found'}`)
    results.push(`Rows: ${this.rows}`)
    results.push(`Cols: ${this.cols}`)
    results.push(`Bits Allocated: ${this.bitsAllocated}`)
    results.push(`Photometric Interpretation: ${this.photometricInterpretation}`)
    results.push(`Samples per Pixel: ${this.samplesPerPixel}`)
    results.push(`Number of Frames: ${this.numberOfFrames}`)
    return results.join('\n')
  }
}
