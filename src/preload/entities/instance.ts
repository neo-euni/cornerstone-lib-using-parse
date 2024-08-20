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

  getSopInstanceUID(): string {
    return this.sopInstanceUID
  }
  getInstanceNumber(): string {
    return this.instanceNumber
  }
  getRows(): number {
    return this.rows
  }
  getColumns(): number {
    return this.columns
  }
  getBitsAllocated(): number {
    return this.bitsAllocated
  }
  getBitsStored(): number {
    return this.bitsStored
  }
  getHighBit(): number {
    return this.highBit
  }
  getPixelRepresentation(): number {
    return this.pixelRepresentation
  }

  print = (): string => {
    const results: (string | number)[] = []
    results.push(`SOPInstanceUID: ${this.getSopInstanceUID()}`)
    results.push(`InstanceNumber: ${this.getInstanceNumber()}`)
    results.push(`Rows: ${this.getRows()}`)
    results.push(`Columns: ${this.getColumns()}`)
    results.push(`BitsAllocated: ${this.getBitsAllocated()}`)
    results.push(`BitsStored: ${this.getBitsStored()}`)
    results.push(`HighBit: ${this.getHighBit()}`)
    results.push(`PixelRepresentation: ${this.getPixelRepresentation()}`)

    return results.join('\n') // 각 항목을 줄바꿈으로 구분하여 문자열로 반환
  }
}
