import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import parse from './dicomFileParse'
import { toArrayBuffer } from './imageParse'

const api = {
  parseDicomFile: (filePath: string) => {
    console.log('[preload] api.parsedDicomFile in')
    console.log('[preload] File path received:', filePath)
    const parsedData = parse(filePath)
    return parsedData
  },
  parseAndLoadImage: async (filePath: string): Promise<any> => {
    try {
      console.log('filePath:', filePath) // filepaht가 제대로 들어옴
      console.log('[preload] api.parseAndLoadImage in') // 여기까지는 잘 들어옴
      // filePath를 읽어서 ArrayBuffer로 변환
      // TODO: 여기부터 preload 스크립트를 읽지 못한다고 함
      const arrayBuffer = toArrayBuffer(filePath)
      // TODO: 경로문제임을 확인
      // console.log('arrayBuffer:', arrayBuffer)

      // ArrayBuffer를 이미지로 변환
      // const image = await loadImage(arrayBuffer)
      console.log('이미지함수까지 왔낭')
      // return image
    } catch (error) {
      console.error('Error parsing and loading DICOM file:', error)
      throw error
    }
  }
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
