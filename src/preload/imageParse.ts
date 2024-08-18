import * as cornerstone from 'cornerstone-core'
import * as cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader'
import * as dicomParser from 'dicom-parser'
import { readDicomFileToArrayBuffer } from './helpers/bufferUtils'

// cornerstone 및 cornerstoneWADOImageLoader 라이브러리는 ArrayBuffer를 사용하여 이미지를 처리
// Cornerstone과 dicomParser 통합
cornerstoneWADOImageLoader.external.cornerstone = cornerstone
cornerstoneWADOImageLoader.external.dicomParser = dicomParser

export function toArrayBuffer(filePath: string): ArrayBuffer {
  console.log('filePathToArrayBuffer function in ')
  // 파일을 읽어 ArrayBuffer로 변환
  // file system에서 데이터를 읽어올 때, 데이터는 바이너리 포맷으로 되어있음
  // 텍스트 데이터만 처리한다면 문자열로 처리할 수 있지만, 이미지나 오디오 또는 dicom 같은 바이너리 데이터는 buffer로 처리해야한다.
  // buffer와 ArrayBuffer의 차이?
  // buffer는 node.js에서 제공하는 데이터 타입으로, 바이너리 데이터를 다룰 때 사용한다.
  // ArrayBuffer는 웹 표준으로, 브라우저 환경에서 바이너리 데이터를 다룰 때 사용한다. buffer내부에 arrayBuffer를 참조함.
  return readDicomFileToArrayBuffer(filePath)
}

// 위에서 만든 filePathToArrayBuffer()를 이용하여 ArrayBuffer를 이미지로 변환
export function loadImage(arrayBuffer: ArrayBuffer): Promise<any> {
  console.log('loadImage function in')
  const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(arrayBuffer)
  return cornerstone.loadImage(imageId)
}

export function test() {
  console.log('test function in')
}
