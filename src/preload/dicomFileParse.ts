import dicomParser from 'dicom-parser'
// import dotenv from 'dotenv'

import { Patient } from './entities/patient'
import { Study } from './entities/study'
import { Series } from './entities/series'
import { Instance } from './entities/instance'
import { Preamble } from './entities/preamble'
import { Prefix } from './entities/prefix'
import { FileMetaElements } from './entities/fileMetaElements'
import { readDicomFileToBuffer } from './helpers/bufferUtils'
import { Image } from './entities/image'

// import fs from 'fs'

class ParsedData {
  constructor(
    public preamble: Preamble,
    public prefix: Prefix,
    public fileMetaElements: FileMetaElements,
    public patient: Patient,
    public studies: Study,
    public series: Series,
    public instance: Instance,
    public image: Image
  ) {}
}

function dicomParseDataSet(filePath: string): ParsedData {
  console.log('dicomParsedDataSet function in')
  const dicomFileBuffer: Buffer = readDicomFileToBuffer(filePath) // bufferUtils 모듈 사용
  const byteArray: Uint8Array = new Uint8Array(dicomFileBuffer) // dicomParser라이브러리는 바이너리 데이터를 Uint8Array로 받아들이기 때문에 변환
  const dicomDataSet = dicomParser.parseDicom(byteArray) // dicomParser를 사용하여 데이터셋 파싱
  console.log('filePath 제대로 들어왔나: ', filePath)

  // header 객체 생성
  const preamble = new Preamble(byteArray.slice(0, 128))
  console.log(preamble.print())

  const prefix = new Prefix(byteArray.slice(128, 132).toString())
  console.log(prefix.print())

  const fileMetaElements = new FileMetaElements(dicomDataSet)
  console.log(fileMetaElements.print())

  // 엔티티 객체 생성
  const patient = new Patient(dicomDataSet)
  console.log(patient.print())

  const studies = new Study(dicomDataSet)
  console.log(studies.print())

  const series = new Series(dicomDataSet)
  console.log(series.print())

  const instance = new Instance(dicomDataSet)
  console.log(instance.print())

  const image = new Image(dicomDataSet)
  console.log('이미지 객체 생성하고왔어 image객체가 생성되고 이 로그가 떠야해')

  return new ParsedData(
    preamble,
    prefix,
    fileMetaElements,
    patient,
    studies,
    series,
    instance,
    image
  )
}

export default dicomParseDataSet

// const data = parserDicomFile(dicomFilePath)
// console.log(data.preamble.print())
// console.log(data.prefix.print())
