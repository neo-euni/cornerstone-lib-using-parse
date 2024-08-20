// import { readDicomFileToArrayBuffer, readDicomFileToBuffer } from './helpers/bufferUtils'

// export default function LoadImage(filePath: string): ArrayBuffer {
//   console.log('오니안오니')
//   try {
//     // filePath를 읽어서 ArrayBuffer로 변환
//     console.log('[imageParse.ts]parseAndLoadImage function in, filePath:', filePath)

//     // input: 'C:\\Users\\user\\Downloads\\dicom_viewer_0004\\0004.DCM'를 arrayBuffer로 변환한 객체.
//     // output: image object가 프로미스에 감싸져서 반환됨
//     // workflow: filePath -> filePath의 주소를 따라 filaPath를 찾음 -> ImageLoader: arrayBuffer(바이너리 데이터 처리) -> promise<image object> -> return image object
//     readDicomFileToArrayBuffer(filePath)
//     const arrayBuffer = readDicomFileToArrayBuffer(filePath) //TODO: readDeicomFileToArrayBuffer() 접근 확인함
//     console.log('arrayBuffer:', arrayBuffer) // TODO: arrayBuffer가 제대로 출력되는지 확인했음

//     // cornerstoneWADOImageLoader.wadouri.fileManager.add(arrayBuffer) // TODO: 찾았다 범인.
//     return arrayBuffer
//   } catch (error) {
//     console.error('Error loading DICOM image:', error)
//     throw error
//   }
// }

// /*
//     cornerstone WADO Image Loader 공식문서 설정 참고
//     cornerstoneWADOImageLoader.configure({
//       useWebWorkers: true, // web worker 사용 여부, default: true , 메인 스레드와 분리되어 수행되어 브라우저가 멈추지 않음
//       decodeConfig: {
//         // 디코딩 설정
//         convertFloatPixelDataToInt: false //부동 소수점 픽셀 데이터를 정수로 변환할지 여부
//       }
//     })

//     var config = {
//       maxWebWorkers: navigator.hardwareConcurrency || 1, // 사용가능한 웹 워커 최대 수 navigator.hardwareConcurrency는 사용자의 CPU 코어 수를 반환(=동시에 처리할 수 있는 작업의 수를 제어), 이 값이 존재하지 않으면 1로 설정
//       startWebWorkersOnDemand: false, // 웹 워커를 요청시 시작할지 여부, default: false / 웹 워커가 필요할 때 즉시 시작
//       taskConfiguration: {
//         // 디코딩 작업에 대한 세부 설정을 제공
//         decodeTask: {
//           initializeCodecsOnStartup: true, // 디코딩에 필요한 코덱이 웹 워커가 시작될 때 미리 초기화됨
//           strict: false // false: 덜 까다로운 디코딩 규칙을 사용하여 더 많은 DICOM 파일을 처리할 수 있음
//         }
//       }
//     }

//     cornerstoneWADOImageLoader.webWorkerManager.initialize(config) // config 객체를 사용하여 웹 워커 매니저를 초기화함
//     */
// /*
//      - cornerstoneWADOImageLoader.wadouri.fileManager.add(arrayBuffer)함수에서 Unable to load preload script:error 발생
//      - why? DICOM 이미지를 웹 애플리케이션에서 로드하고 처리하기 위해 사용
//      - ref: https://www.cornerstonejs.org/docs/concepts/cornerstone-core/imageloader/
//      */
// // const image = await cornerstone.loadImage(imageId)
// //     console.log('Image loaded successfully:', image)
// //     return image
