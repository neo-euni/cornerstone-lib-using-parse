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
              <q-file outlined v-model="file" label="Open File" @input="parseDicomFile">
                <template v-slot:prepend>
                  <q-icon name="attach_file" />
                </template>
              </q-file>
            </div>
          </div>
          <div class="dicom-image-section">
            <div class="dicom-image-section">
              <!-- DiCOM Image rendered -->
              <div id="dicomImage"></div>
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
import * as cornerstone from 'cornerstone-core' // DICOM 이미지를 렌더링하는 라이브러리
// import * as cornerstoneTools from 'cornerstone-tools' // 이미지를 조작하는 도구를 제공하는 라이브러리

/*
scope
- var: 같은 함수 내 동일한 이름의 변수 재선언 가능 (함수 스코프), 호이스팅, 초기화 전에 접근 가능
- let: 같은 블록 내 동일한 이름의 변수 재선언 불가능 (블록 스코프), 호이스팅, 초기화 전에 접근 불가능(ReferenceError 발생), 재할당 가능
- const: 같은 블록 내 동일한 이름의 변수 재선언 불가능 (블록 스코프), 호이스팅, 초기화 전에 접근 불가능(ReferenceError 발생), 재할당 불가능
*/
const tab = ref('study')
const text = ref('')
const dense = ref(false)
const model = ref(null)
const file = ref<File | null>(null) // v-model을 사용하기 위해 ref로 선언, 사용자가 file input에 선택한 최신 파일 정보를 저장(이전 파일 객체를 덮어쓰고 새로운 파일 객체 저장)
const parsedData = ref<ParsedData | null>(null) // 파일 선택 시 파일 정보가 저장됨. template에서 사용되기 위해 전역변수로 ref로 선언

function parseDicomFile() {
  // console.log('function handleFileSelection in')
  let filePath: string = 'C:\\Users\\user\\Downloads\\dicom_viewer_0004\\0004.DCM'

  /*
  window.api로 호출하는 이유?
  contextBridge.exposeInMainWorld를 사용해 노출한 api 객체가 렌더러 프로세스의 window 객체에 바인딩되기 때문임
  */
  parsedData.value = window.api.parseDicomFile(filePath)
  console.log('parsedData.value:', parsedData)

  // dicom 파일을 읽고 렌더링 하는 전체 프로세스 제어 함수
  // filePath를 프리로드 스크립트로 보낸 뒤, file을 읽어 buffer로 변환하고, cornerstoneWADOImageLoader에 의해 DICOM 이미지로 변환
  // image: cornerstoneWADOImageLoader에 의해 변환된 DICOM 이미지
  window.api
    .parseAndLoadImage(filePath)
    .then((image) => {
      const element = document.getElementById('dicomImage')
      cornerstone.displayImage(element, image)
    })
    .catch((error) => {
      console.error('Image load failed:', error)
    })

  // if(!file.value) return;

  /*
  TODO: filePath가 아닌 file객체를 인자로 preload로 보내줘야 한다고 함
  function parseDicomFile() {
  console.log('function parseDicomFile in');
  // if(!file.value) return;
  parsedData= window.api.parseDicomFile(file);
  */
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
// computed: vue의 함수형 속성. computed의 파라미터는 로직을 가지고 값을 계산한 후 리턴하는 함수
//'계산된' 값을 제공하는 함수를 반환, computed 함수를 변경하려면 getter, setter를 사용
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
