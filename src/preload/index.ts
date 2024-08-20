import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
// import imageParse from './imageParse'
import parse from './dicomFileParse'

const api = {
  parseDicomFile: (filePath: string) => {
    console.log('[preload] api.parsedDicomFile in')
    console.log('[preload] File path received:', filePath)
    const parsedData = parse(filePath)
    return parsedData
  }

  /*
  input: 'C:\\Users\\user\\Downloads\\dicom_viewer_0004\\0004.DCM'
  output: 
  */
  // decodeImageFile: (filePath: string) => {
  //   console.log('[preload] api.decodeImageFile in')
  //   console.log('[preload] File path received:', filePath)
  //   const image = imageParse(filePath)
  //   return image
  // }
}

/*
contextIsolated를 활성화 하면,
preload script와 웹 페이지 스크립트가 서로 다른 컨텍스트에서 실행되기 때문에
웹 스크립트는 시스템 리소스에(preload script) 직접 접근할 수 없다. (sandbox: true)
contextBridge.exposeInMainWorld를 사용하여 renderer 프로세스에서만 사용할 수 있는 API를 노출할 수 있다.
*/
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
