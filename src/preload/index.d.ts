import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface ParsedData {
    preamble: preamble
    prefix: prefix
    fileMetaElements: fileMetaElements
    patient: patient
    studies: study
    series: series
    instance: instance
  }

  interface Window {
    electron: ElectronAPI
    api: {
      parseDicomFile(filePath: string): DicomData
    }
  }
}
