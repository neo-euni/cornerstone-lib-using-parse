<template>
  <q-page class="q-pa-none">
    <div class="body-container">
      <div class="main-content-area">
        <div class="folder-section">
          <div class="content-header">
            <div class="patient-info-label">Patient Information</div>
          </div>
          <div class="patient-info-value">
            <div class="q-pa-md left-align-container" style="max-width: 350px">
              <q-list>
                <q-item>
                  <q-item-section>
                    <q-item-label class="left-align">name</q-item-label>
                    <q-item-label caption lines="2" class="left-align">
                      {{ parsedData?.patient?.name ?? 'No name available' }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
                <q-separator spaced inset />
                <q-item>
                  <q-item-section>
                    <q-item-label class="left-align">ID</q-item-label>
                    <q-item-label caption lines="2" class="left-align">{{
                      parsedData?.patient?.patientId ?? 'No ID available'
                    }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-separator spaced inset />
                <q-item>
                  <q-item-section>
                    <q-item-label class="left-align">birth date</q-item-label>
                    <q-item-label caption lines="2" class="left-align">{{
                      formatBirthDate(parsedData?.patient?.birthDate)
                    }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-separator spaced inset />
                <q-item>
                  <q-item-section>
                    <q-item-label class="left-align">sex</q-item-label>
                    <q-item-label caption lines="2" class="left-align">{{
                      parsedData?.patient?.sex
                    }}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-separator spaced inset />
              </q-list>
            </div>
          </div>
        </div>
        <div class="patient-info-image-section">
          <div class="content-header">
            <div class="folder-open-area">
              <!-- 
              file 변수를 전역 또는 컴포넌트 스코프에서 선언하고, 
              v-model을 통해 이 변수에 파일 객체가 바인딩되었기 때문에, 
              parseDicomFile 함수를 호출할 때 이 변수를 인자로 전달할 필요없음
              -->
              <q-file
                outlined
                v-model="file"
                label="Open File"
                @input="parseDicomFile"
                accept=".dcm"
              >
                <template v-slot:prepend>
                  <q-icon name="attach_file" />
                </template>
              </q-file>
            </div>
          </div>
          <div class="dicom-image-section">
            <div class="dicom-image-section">
              <!-- DiCOM Image rendered -->
              <div id="dicomImage" style="width: 100%; height: 100%"></div>
            </div>
          </div>
        </div>
        <div class="tab-parse-section">
          <div class="content-header">
            <div class="tag-search">
              <q-input outlined v-model="text" label="tag search">
                <template v-slot:append>
                  <q-icon
                    v-if="text !== ''"
                    name="close"
                    @click="text = ''"
                    class="cursor-pointer"
                  />
                  <q-icon style="color: var(--color-secondary)" name="search" />
                </template>
              </q-input>
            </div>
          </div>
          <div class="tab-content">
            <!-- dense: 내부요소를 compact하게 설정/ 공간절약을 위함. 여기서는 quasar tab option으로 사용중 -->
            <q-tabs class="custom-tabs" v-model="tab" dense>
              <q-tab name="header" label="Header" />
              <q-tab name="study" label="Study" />
              <q-tab name="series" label="Series" />
              <q-tab name="instance" label="Instance" />
            </q-tabs>
          </div>

          <div class="horizontal-container">
            <div class="tag-area">
              <div class="tag-label">TAG Description</div>
              <div class="tag-list">
                <!-- 
                - 현재요소: tag, index=0으로 설정된 상태
                - tagData라는 객체에서 현재 선택된 tab에 해당하는 tag배열을 가져옴
                - tabData는 여러 탭에 대한 데이터를 담고있고,
                - tab은 현재 선택된 인덱스 값 
                - tab에 해당하는 tags항목들을 순회하며 모두 출력
                -->
                <div v-for="(tag, index) in tagData[tab].tags" :key="index" class="tag-item">
                  {{ tag }}
                </div>
              </div>
            </div>
            <div class="value-area">
              <div class="value-label">Value</div>
              <div class="value-list">
                <div v-for="(value, index) in tagData[tab].values" :key="index" class="value-item">
                  {{ value }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

/*
scope
- var: 같은 함수 내 동일한 이름의 변수 재선언 가능 (함수 스코프), 호이스팅, 초기화 전에 접근 가능
- let: 같은 블록 내 동일한 이름의 변수 재선언 불가능 (블록 스코프), 호이스팅, 초기화 전에 접근 불가능(ReferenceError 발생), 재할당 가능
- const: 같은 블록 내 동일한 이름의 변수 재선언 불가능 (블록 스코프), 호이스팅, 초기화 전에 접근 불가능(ReferenceError 발생), 재할당 불가능
*/
const tab = ref('study')
const text = ref('')
const file = ref<File | null>(null) // v-model을 사용하기 위해 ref로 선언, 사용자가 file input에 선택한 최신 파일 정보를 저장(이전 파일 객체를 덮어쓰고 새로운 파일 객체 저장)
const parsedData = ref<ParsedData | null>(null) // 파일 선택 시 파일 정보가 저장됨. template에서 사용되기 위해 전역변수로 ref로 선언

function parseDicomFile() {
  let filePath: string = 'C:\\Users\\user\\Downloads\\dicom_viewer_0004\\0004.DCM'

  /*
  window.api로 호출하는 이유?
  contextBridge.exposeInMainWorld를 사용해 노출한 api 객체가 렌더러 프로세스의 window 객체에 바인딩되기 때문임
  */
  parsedData.value = window.api.parseDicomFile(filePath)
  console.log('parsedData.value:', parsedData)

  // description: renderDicomToDiv 함수를 사용하여 dicom이미지를 dicomImage div에 렌더링함
  // input: 파싱된 객체안에 Image객체
  // output: void
  renderDicomToDiv(parsedData)
  console.log(typeof parsedData) // type: object
}

// input: 파싱결과가 저장된 Image 인스턴스
// output: void, div에 이미지를 렌더링 함
// descriptio: DICOM 이미지를 div 요소에 렌더링하는 함수
function renderDicomToDiv(parsedData) {
  console.log('div요소에 렌더링하는 함수에 들어옴')

  const imageDataSet = parsedData.value?.image // 이미지 데이터
  console.log('imageDataSet:', imageDataSet)
  const rows = parsedData.value?.image?.rows //이미지의 높이(행 수)
  console.log('rows:', rows)
  const cols = parsedData.value?.image?.cols // 이미지의 너비(열 수)
  console.log('columns:', cols)
  const pixelData = parsedData.value?.image?.pixelData // 이미지의 픽셀 데이터
  console.log('pixelData:', pixelData) // log 찍힘 완료
  console.log(typeof pixelData) // type: Uint8ClampedArray
  if (!pixelData || !rows || !cols) {
    console.error('Invalid pixel data, rows or columns')
    return
  }

  /*
  input: document.getElementById('dicomImage')
  output: (type:HTMLElement) div의 id가 'dicomImage' 요소를 반환
  */
  const dicomImageDiv = document.getElementById('dicomImage')
  if (!dicomImageDiv) {
    console.error('Div with id "dicomImage" not found')
    return
  }

  let canvas = dicomImageDiv.querySelector('canvas') // 이미 존재하는 canvas를 찾습니다.

  if (!canvas) {
    // canvas가 존재하지 않으면 새로 생성합니다.
    canvas = document.createElement('canvas')
    /*
    기존 canvas가 있다고 하더라도 이미지 자체는 복사되지 않는다
    새로운 canvas 요소를 메모리상에서 생성. HTML에 미리 <canvas> 태그가 있어야 할 필요는 없음
    생성된 canvas를 DOM에 추가해야만 화면에 보이게 됨. 추가하지 않으면 메모리에만 존재
    */
    dicomImageDiv.appendChild(canvas) // 생성된 canvas를 DOM에 추가
  }

  /*
   ctx: canvas의 2d 그래픽 컨텍스를 가리킴
   input: 2d를 인자로 전달
   output: CanvasRenderingContext2D 객체 반환
   description:
    - html canvas 요소에서 2d그래픽 컨텍스트를 가져와 그래픽을 그리기 위한 준비 작업을 함
   */
  const ctx = canvas.getContext('2d')
  console.log('ctx:', ctx)
  /*
  canvas 요소가 잘못 초기화되었거나, 브라우저가 2D 컨텍스트를 지원하지 않는 경우에는 null을 반환함 -> 그러나 이런경우는 거의 없음
  */
  if (!ctx) {
    console.error('Failed to get 2D context')
    return
  }

  // canvas의 너비와 높이를 설정해줘야함, default값은 300x150
  canvas.width = cols
  canvas.height = rows

  /*
  0. 1 bit: 0과 1로 이루어진 데이터의 최소 단위
  1. 1 byte: 8비트로 이루어진 데이터 단위
  2. 1 pixel: 화소, 화면을 구성하는 가장 기본적인 단위, 한 픽셀에 8비트를 할당하면 한 픽셀은 256가지 색상을 표현할 수 있음
   - 16비트: 하이컬러(R:G:B = 5:6:5) -> 65536가지 색상 표현 가능
   - 24비트: 트루컬러(R:G:B = 8:8:8) -> 1677만가지 색상 표현 가능
  3. 해상도: 단위 길이당 픽셀의 수
  4. dpi(dots per inch): 인치당 픽셀의 수, pixel 이 1인치에 많이 들어간다면 해상도가 좋다는 의미
  5. dicom-file의 image type은 JPEG는 손실 압축 방식으로, 이미지의 데이터가 압축되어 저장되어 있음, 알파(투명도) 채널이 없음.

  결론:
  나의 dicomFile sample은, 8비트 그레이스케일(MONOCHROME2: pixel값이 낮을 수록 어두운 색에 가까움 0=검정, 255=흰색) 이미지를 JPEG Baseline (Process 1) 형식으로 압축한 것
 TODO: 프로덕션 환경에서는
  - Photometric Interpretation: 이미지타입 정의
  - Bits Allocated: 각 필셀에 할당된 비트 수
  - Transfer Syntax UID: image 압축형태? image파일 타입 확인.  jpeg, png등
  - Number of Frames : 프레임 수
  를 확인하여 이미지 렌더링하는 방법에 대한 함수를 각각 정의해야한다.
  */

  //description: dicom image가 몇 비트로 표현되는지 확인
  // output: (number)각 필셀에 할당된 비트 수 (default: 8), 256단계의 회색을 표현할 수 있음
  const bitsAllocated = parsedData.value?.image?.bitsAllocated || 8
  console.log('bitsAllocated:', bitsAllocated)

  // description: cols x rows 크기의 픽셀데이터를 담을 imageData 타입의 메모리 공간 생성.
  //input: cols, rows -> 이미지의 너비와 높이: 512x512=262144
  //output: ImageData타입의 객체, Uint8ClampedArray 타입의 배열
  const imageData = ctx.createImageData(cols, rows)
  console.log(
    'imageData 그려진 canvas에 픽셀을 담을 메모리 공간만 설정되어야 함, 따라서 col * row * 알파채널(불투명도) =1048576개의 빈 배열이 그려져야함:',
    imageData
  )

  /*
  description: imageData.data는 Uint8ClampedArray 타입의 배열을 반환함
  */
  const imageDataArray = imageData.data
  console.log(
    'imageData타입의 data라는 배열에 접근하는것. imageData타입 전체가 나오면 안됨[0,0,0]',
    imageDataArray
  )

  /*
  하나의 프레임 index 크기를 설정
  return type: number
  */
  const frameSize = cols * rows
  console.log('frameSize 262144나와야함:', frameSize) // 262144

  /*
  다중 프레임에서 선택 된 프레임의 픽셀데이터만 가져오는 함수(만들어야함)
  input: pixelData
  output: imageDataSize 픽셀 데이터를 담을 메모리 공간(imageDataSize)에 픽셀 값을 할당함 -> return type: imageData
  */
  const firstFramePixelData = pixelData.slice(0, frameSize)
  console.log('firstFrameData: 첫번째 frame image만 진짜왔는지 확인해야함', firstFramePixelData)

  /*
  input: firstFramePixelData
  output: 하나의 프레임에 해당하는 pixelData를 순회하며 canvas에 픽셀 값을 할당함
  */
  for (let i = 0; i < firstFramePixelData.length; i++) {
    // i = 0
    let grayscaleValue = firstFramePixelData[i] // grayscaleValue = 0
    let rgbaIdx = i * 4 // rgbaIdx = 0

    // ImageData의 RGBA 배열에 값 할당
    imageData.data[rgbaIdx] = grayscaleValue // Red //imageData.data[0] = 0
    imageData.data[rgbaIdx + 1] = grayscaleValue // Green
    imageData.data[rgbaIdx + 2] = grayscaleValue // Blue
    imageData.data[rgbaIdx + 3] = 255
    // imageDataArray[i] = pixelValue
  }
  console.log('putImageData: for문에 들어갔나', imageDataArray)
  console.log('imageDataArray에 pixel data들어있는 갯수:', imageDataArray.length)
  ctx.putImageData(imageData, 0, 0)
}

function formatBirthDate(dateStr: string | undefined): string {
  if (!dateStr) return 'Invalid date'

  const year = dateStr.slice(0, 4)
  const month = dateStr.slice(4, 6)
  const day = dateStr.slice(6, 8)

  if (year && month && day) {
    return `${year}-${month}-${day}`
  } else {
    return 'Invalid date'
  }
}

// computed: vue의 함수형 속성. computed의 파라미터는 로직을 가지고 값을 계산한 후 리턴하는 함수 / 계산된' 값을 제공하는 함수를 반환, computed 함수를 변경하려면 getter, setter를 사용
const tagData = computed(() => ({
  header: {
    tags: ['Prefix', 'transferSyntaxUID'],
    values: [
      parsedData.value?.prefix?.prefix || 'No prefix available',
      parsedData.value?.fileMetaElements?.transferSyntaxUID || 'No transfer syntax UID available'
    ]
  },
  study: {
    tags: ['Study Date', 'Study Time', 'Study Modality', 'Study Description', 'studyInstanceUid'],
    values: [
      formatBirthDate(parsedData.value?.studies?.studyDate) || 'No date available',
      parsedData.value?.studies?.studyTime || 'No time available',
      parsedData.value?.studies?.modality || 'No modality available',
      parsedData.value?.studies?.description || 'No description available',
      parsedData.value?.studies?.studyInstanceUid || 'No instance UID available'
    ]
  },
  series: {
    tags: ['SeriesInstanceUID', 'Series Number'],
    values: [
      parsedData.value?.series?.seriesInstanceUID || 'No series instance UID available',
      parsedData.value?.series?.seriesNumber || 'No series number available'
    ]
  },
  instance: {
    tags: [
      // 'SopInstanceUID',
      'Instance Number',
      'Instance Date',
      'Instance Time',
      'Instance Description',
      'Columns',
      'Rows',
      'HighBit',
      'BitsAllocated',
      'BitsStored'
    ],
    values: [
      // parsedData.value?.instance?.sopInstanceUID || 'No SOP instance UID available',
      parsedData.value?.instance?.seriesNumber || 'No series number available',
      formatBirthDate(parsedData.value?.instance?.seriesDate) || 'No series date available',
      parsedData.value?.instance?.seriesTime || 'No series time available',
      parsedData.value?.instance?.seriesDescription || 'No series description available',
      parsedData.value?.instance?.columns || 'No columns available',
      parsedData.value?.instance?.rows || 'No rows available',
      parsedData.value?.instance?.highBit || 'No high bit available',
      parsedData.value?.instance?.bitsAllocated || 'No bits allocated available',
      parsedData.value?.instance?.bitsStored || 'No bits stored available'
    ]
  }
}))
</script>

<style scoped>
.body-container {
  max-height: calc(100vh - 103.72px);
  height: 100vh;
  display: flex;
  width: 100%;
  box-sizing: border-box;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
}

.main-content-area {
  display: flex;
  width: 1280px;
  /* height: 976.28px; */
  max-width: 100%;
  margin: auto;
  overflow: auto;
  box-sizing: border-box;
}

.folder-section {
  width: 168px;
  box-sizing: border-box;
}

.patient-info-image-section {
  width: 675px;
  box-sizing: border-box;
  overflow: hidden;
  margin: 0px 10px;
}

.dicom-image-section {
  width: 100%;
  height: 710px;
  overflow: hidden;
  box-sizing: border-box;
  border: 0.125rem solid var(--color-primary);
  box-shadow: 0px 0px 10px 0px var(--color-quaternary);
  object-position: center;
  border-radius: 5px;
  display: block;
}

.dicom-image-section img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.patient-info-value {
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  height: 710px;
  background-color: var(--color-section-background);
  border-radius: 5px;
  display: flex;
  justify-content: center;
}

.patient-info-label {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  background-color: var(--color-primary);
  height: 100%;
  padding: 10px;
  font-weight: 600;
}

.folder-open-area {
  width: 100%;
  height: 70px;
  background-color: var(--color-section-background);
  border-radius: 5px;
  overflow: hidden;
  box-sizing: border-box;
  padding: 7px;
}

.tab-parse-section {
  width: 438px;
  box-sizing: border-box;
}

.tab-content {
  width: 100%;
  height: 35px;
}

.horizontal-container {
  display: flex;
  flex-direction: row;
  height: 675px;
  width: 100%;
}

.tag-area {
  flex: 4;
  /* flex: 1; */
  display: flex;
  /* align-items: center; */
  flex-direction: column;
  margin-right: 5px;
}
.value-area {
  flex: 6;
  display: flex;
  align-items: center;
  flex-direction: column;
}

.custom-tabs {
  background-color: var(--color-quaternary);
  border-bottom: 2px solid var(--color-secondary);
  border-radius: 5px;
}
.custom-tabs .q-tab {
  color: var(--color-secondary);
  font-weight: bold;
  position: relative;
  border-radius: 5px;
}

.custom-tabs .q-tab:not(:last-child)::after {
  content: '';
  position: absolute;
  right: 0;
  top: 12px;
  height: 16px;
  width: 1px;
  background-color: var(--color-secondary);
}

.custom-tabs .q-tab--active {
  background-color: var(--color-secondary);
  color: var(--color-quaternary);
}

.custom-tabs .q-tabs--indicator {
  background-color: var(--color-primary);
}

.content-header {
  width: 100%;
  height: 70px;
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.tag-list {
  flex: 4;
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  background-color: var(--color-section-background);
}
.value-list {
  flex: 6;
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  background-color: var(--color-section-background);
}

.tag-item {
  width: 4;
  font-weight: 500;
  margin-bottom: 5px;
}

.value-item {
  /* TODO: 하드코딩으로 집어넣은거라 전체적인 레이아웃 조정이 필요 */
  width: 235.49px;
  /* width: 100%; */
  word-wrap: break-word;
  overflow-wrap: break-word;
  flex-direction: row;
  margin-bottom: 5px;
  font-weight: 400;
  justify-self: start;
  gap: 10px;
}

.tag-search {
  width: 100%;
  max-height: 100%;
  height: auto;
}

.tag-label,
.value-label {
  font-weight: 600;
  width: 100%;
  font-size: 1.1em;
  padding: 5px 10px;
  border-radius: 5px;
  margin: 15px 0px;
  background-color: var(--color-primary);
}
</style>

<!-- /*

전체 flow
- input: arrayBuffer
- output: Promise<Image Object>, cornerstone.loadImage(imageId)는 Promise를 반환하고 이미지 로딩이 완료되면 resolve되어 이미지 객체를 반환함
- flow: arrayBuffer -> cornerstone lib에 전달 -> cornerstoneWADOImageLoader을 사용하여 arrayBuffer를 처리 ->  ImageId 생성 -> 생성된 ImageId를 cornerstone.loadImage 함수에 전달하여 이미지를 로드
// Cornerstone과 dicomParser 통합
cornerstoneWADOImageLoader.external.cornerstone = cornerstone
cornerstoneWADOImageLoader.external.dicomParser = dicomParser

/*
input: filePath
output: arrayBuffer
description: window.api.dicomFileToArrayBuffer 함수를 사용하여 filePath를 전달하여 file을 arrayBuffer로 변환함
*/
const dicomFileToArrayBuffer = window.api.dicomFileToArrayBuffer(filePath)
console.log('dicomFileToArrayBuffer:', dicomFileToArrayBuffer) // 들어온 것 확인함  -> arrayBuffer(560498)

/*
input: dicomFileToArrayBuffer(arrayBuffer) -> 메모리에 로드된 DICOM 파일의 바이너리 데이터
output: imageId(string) 설정
description: cornerstone WADO Image Loader에서 DICOM 파일을 메모리에 저장하고 이를 참조할 수 있는 고유한 imageId를 반환하는 함수  
cornerstoneWADOImageLoader.wadouri.()는 
fileManager.add()는 arrayBuffer로 부터 DICOM 파일을 받아 메모리에 저장하고 이 파일을 참조할 수 있는 고유 식별자인 ImageId를 생성한다. 이 imageID는 dicom 파일을 메모리에서 로드할 때 사용된다. 
*/
imageId.value = cornerstoneWADOImageLoader.wadouri.fileManager.add(dicomFileToArrayBuffer)


/*
input: bold타입으로 변환된 arrayBuffer의 ImageId
output: Promise<Bold타입> : Bold: Binary Large Object
description: cornerstone을 통해 이미지를 로드하는 함수, 이미지를 로드하고 로드된 이미지 객체를 반환함 / 반환 타입은 promise객체이기 때문에 async/await를 사용하여 비동기 처리함
*/
// cornerstone
//   .loadImage(imageId) //
//   .then(function (image) {
//     const element = document.getElementById('dicomImage')
//     cornerstone.displayImage(element, image)
//   })
//   .catch(function (error) {
//     console.error('Error loading image:', error)
//   })



/*
TODO: filePath가 아닌 file객체를 인자로 preload로 보내줘야 한다고 함
function parseDicomFile() {
console.log('function parseDicomFile in');
// if(!file.value) return;
parsedData= window.api.parseDicomFile(file);
*/ -->
