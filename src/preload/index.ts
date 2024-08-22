import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import parse from './dicomFileParse'

const api = {
  parseDicomFile: (filePath: string) => {
    console.log('[preload] api.parsedDicomFile in')
    console.log('[preload] File path received:', filePath)
    const parsedData = parse(filePath)
    return parsedData
  }
}

if (process.contextIsolated) {
  try {
    // 해당 api를 renderer process의 window 객체에 노출
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
