import { DataSet } from 'dicom-parser'
import { get } from 'http'

export class Image {
  private dataSet: DataSet
  private pixelData: Uint8Array | undefined
  private rows: number
  private cols: number
  private bitsAllocated: number
  private photometricInterpretation: string
  private samplesPerPixel: number
  private numberOfFrames: number
  private sopInstanceUID: string

  constructor(dataSet: DataSet) {
    this.dataSet = dataSet
    this.rows = dataSet.uint16('x00280010') || 512
    this.cols = dataSet.uint16('x00280011') || 512
    this.bitsAllocated = dataSet.uint16('x00280100') || 8
    this.photometricInterpretation = dataSet.string('x00280004') || 'MONOCHROME2'
    this.samplesPerPixel = dataSet.uint16('x00280002') || 1
    this.numberOfFrames = dataSet.uint16('x00280008') || 1
    this.sopInstanceUID = dataSet.string('x00080018') || ''
  }

  //.x7fe00010
    // Pixel Data 요소 초기화
    if (pixelData) {
      // 픽셀 데이터 추출
      this.pixelData = new Uint8Array(
        this.dataSet.byteArray.buffer,
        pixelData.dataOffset,
        pixelData.length
      )
      console.log('Pixel Data:', this.pixelData)
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
    getSopInstanceUID(): number {
      return this.sopInstanceUID
    }
    

    print(): any {
      const results: any = []
      results.push(`    SOPInstanceUID: ${this.getSopInstanceUID()}`)
      results.push(`    Rows: ${this.getRows()}`)
      results.push(`    Columns: ${this.getCols()}`)
      results.push(`    Bits Allocated: ${this.getBitsAllocated()}`)
    }
    return results.join('\n')
  }
}
