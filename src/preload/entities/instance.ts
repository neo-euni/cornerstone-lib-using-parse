import { DataSet } from 'dicom-parser'

export class Instance {
  private dataSet: DataSet
  private sopInstanceUID: string
  private instanceNumber: string
  private rows: number
  private columns: number
  private bitsAllocated: number
  private bitsStored: number
  private highBit: number
  private pixelRepresentation: number

  constructor(dataSet: DataSet) {
    this.dataSet = dataSet
    this.sopInstanceUID = this.dataSet.string('x00080018') || ''
    this.instanceNumber = this.dataSet.string('x00200013') || ''
    this.rows = this.dataSet.uint16('x00280010') || 0
    this.columns = this.dataSet.uint16('x00280011') || 0
    this.bitsAllocated = this.dataSet.uint16('x00280100') || 0
    this.bitsStored = this.dataSet.uint16('x00280101') || 0
    this.highBit = this.dataSet.uint16('x00280102') || 0
    this.pixelRepresentation = this.dataSet.uint16('x00280103') || 0
  }

  getSopInstanceUID = (): string => this.dataSet.string('x00080018') || ''

  getInstanceNumber = (): string => this.dataSet.string('x00200013') || ''

  getImagePosition = (): string => this.dataSet.string('x00200032') || ''

  getImageOrientation = (): string => this.dataSet.string('x00200037') || ''

  getPixelSpacing = (): string => this.dataSet.string('x00280030') || ''

  getRows = (): number => this.dataSet.uint16('x00280010') || 0

  getColumns = (): number => this.dataSet.uint16('x00280011') || 0

  getBitsAllocated = (): number => this.dataSet.uint16('x00280100') || 0

  getBitsStored = (): number => this.dataSet.uint16('x00280101') || 0

  getHighBit = (): number => this.dataSet.uint16('x00280102') || 0

  getPixelRepresentation = (): number => this.dataSet.uint16('x00280103') || 0

  getRescaleIntercept = (): string => this.dataSet.string('x00281052') || ''

  getRescaleSlope = (): string => this.dataSet.string('x00281053') || ''

  getWindowCenter = (): string => this.dataSet.string('x00281050') || ''

  getWindowWidth = (): string => this.dataSet.string('x00281051') || ''

  getPixelData = (): string => this.dataSet.string('x7fe00010') || ''

  print = (): string => {
    const results: (string | number)[] = []
    results.push(`SOPInstanceUID: ${this.getSopInstanceUID()}`)
    results.push(`InstanceNumber: ${this.getInstanceNumber()}`)
    results.push(`ImagePosition: ${this.getImagePosition()}`)
    results.push(`ImageOrientation: ${this.getImageOrientation()}`)
    results.push(`PixelSpacing: ${this.getPixelSpacing()}`)
    results.push(`Rows: ${this.getRows()}`)
    results.push(`Columns: ${this.getColumns()}`)
    results.push(`BitsAllocated: ${this.getBitsAllocated()}`)
    results.push(`BitsStored: ${this.getBitsStored()}`)
    results.push(`HighBit: ${this.getHighBit()}`)
    results.push(`PixelRepresentation: ${this.getPixelRepresentation()}`)
    results.push(`RescaleIntercept: ${this.getRescaleIntercept()}`)
    results.push(`RescaleSlope: ${this.getRescaleSlope()}`)
    results.push(`WindowCenter: ${this.getWindowCenter()}`)
    results.push(`WindowWidth: ${this.getWindowWidth()}`)
    results.push(`PixelData: ${this.getPixelData()}`)

    return results.join('\n') // 각 항목을 줄바꿈으로 구분하여 문자열로 반환
  }
}
