import { DataSet } from 'dicom-parser'

export class Instance {
  private dataSet: DataSet
  private sopInstanceUID: string
  private instanceNumber: string
  private rows: string
  private columns: string
  private bitsAllocated: string
  private bitsStored: string
  private highBit: string
  private pixelRepresentation: string
  private modality: string

  constructor(dataSet: DataSet) {
    this.dataSet = dataSet
    this.sopInstanceUID = this.dataSet.string('x00080018') || ''
    this.instanceNumber = this.dataSet.string('x00200013') || ''
    this.rows = this.dataSet.string('x00280010') || ''
    this.columns = this.dataSet.string('x00280011') || ''
    this.bitsAllocated = this.dataSet.string('x00280100') || ''
    this.bitsStored = this.dataSet.string('x00280101') || ''
    this.highBit = this.dataSet.string('x00280102') || ''
    this.pixelRepresentation = this.dataSet.string('x00280103') || ''
    this.modality = this.dataSet.string('x00080060') || ''
  }

  getSopInstanceUID = (): string => this.dataSet.string('x00080018') || ''

  getInstanceNumber = (): string => this.dataSet.string('x00200013') || ''

  getImagePosition = (): string => this.dataSet.string('x00200032') || ''

  getImageOrientation = (): string => this.dataSet.string('x00200037') || ''

  getPixelSpacing = (): string => this.dataSet.string('x00280030') || ''

  getRows = (): string => this.dataSet.string('x00280010') || ''

  getColumns = (): string => this.dataSet.string('x00280011') || ''

  getBitsAllocated = (): string => this.dataSet.string('x00280100') || ''

  getBitsStored = (): string => this.dataSet.string('x00280101') || ''

  getHighBit = (): string => this.dataSet.string('x00280102') || ''

  getPixelRepresentation = (): string => this.dataSet.string('x00280103') || ''

  getRescaleIntercept = (): string => this.dataSet.string('x00281052') || ''

  getRescaleSlope = (): string => this.dataSet.string('x00281053') || ''

  getWindowCenter = (): string => this.dataSet.string('x00281050') || ''

  getWindowWidth = (): string => this.dataSet.string('x00281051') || ''

  getModality = (): string => this.dataSet.string('x00080060') || ''

  getPixelData = (): string => this.dataSet.string('x7fe00010') || ''

  print = (): string => {
    const results: string[] = []
    results.push(`SOPInstanceUID: ${this.sopInstanceUID}`)
    results.push(`InstanceNumber: ${this.instanceNumber}`)
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
    results.push(`Modality: ${this.getModality()}`)
    results.push(`PixelData: ${this.getPixelData()}`)

    return results.join('\n')
  }
}
