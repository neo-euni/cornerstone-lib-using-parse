import { DataSet } from 'dicom-parser'
import { Instance } from './instance'

export class Series {
  private dataSet: DataSet
  private instanceList: Instance[]
  private seriesInstanceUID: string
  private seriesNumber: string

  constructor(dataSet: DataSet) {
    this.dataSet = dataSet
    this.instanceList = this.extractInstances()
    this.seriesInstanceUID = this.dataSet.string('x0020000e') || ''
    this.seriesNumber = this.dataSet.string('x00200011') || ''
  }

  private extractInstances(): Instance[] {
    const instanceList: Instance[] = []
    const sopInstanceUIDs: Set<string> = new Set()

    Object.keys(this.dataSet.elements).forEach((tag) => {
      if (tag === 'x00080018') {
        // SOPInstanceUID 태그
        const sopInstanceUID = this.dataSet.string(tag)
        if (sopInstanceUID && !sopInstanceUIDs.has(sopInstanceUID)) {
          sopInstanceUIDs.add(sopInstanceUID)
          instanceList.push(new Instance(this.dataSet))
        }
      }
    })

    return instanceList
  }

  getSeriesInstanceUID(): string {
    return this.seriesInstanceUID
  }

  getSeriesNumber(): string {
    return this.seriesNumber
  }

  getInstancesList(): Instance[] {
    return this.instanceList
  }

  print(): string {
    const results: string[] = []
    results.push(`    SeriesInstanceUID: ${this.getSeriesInstanceUID()}`)
    results.push(`    SeriesNumber: ${this.getSeriesNumber()}`)
    results.push('    Instances:')

    this.getInstancesList().forEach((instance) => {
      const instancePrint = instance.print()
      results.push(`      ${instancePrint}`)
    })

    return results.join('\n')
  }
}
