import dicomParser from 'dicom-parser'
// import dotenv from 'dotenv'

import { Patient } from './entities/patient'
import { Study } from './entities/study'
import { Series } from './entities/series'
import { Instance } from './entities/instance'
import { Preamble } from './entities/preamble'
import { Prefix } from './entities/prefix'
import { FileMetaElements } from './entities/fileMetaElements'
const fs = require('fs')



class ParsedData {
  constructor(
    public preamble: Preamble,
    public prefix: Prefix,
    public fileMetaElements: FileMetaElements,
    public patient: Patient,
    public studies: Study,
    public series: Series,
    public instance: Instance
  ) {}
}

function dicomParseDataSet(filePath: string): ParsedData {
  console.log("dicomParsedDataSet function in")
  // console.log("filePath 제대로 들어왔나: ", filePath) 제대로 들어옴

  const dicomFileBuffer: Buffer = fs.readFileSync(filePath)
  const byteArray: Uint8Array = new Uint8Array(dicomFileBuffer)
  const dicomDataSet = dicomParser.parseDicom(byteArray)

  // header 객체 생성
  const preamble = new Preamble(byteArray.slice(0, 128))
  console.log(preamble.print());

  const prefix = new Prefix(byteArray.slice(128, 132).toString())
  console.log(prefix.print());

  const fileMetaElements = new FileMetaElements(dicomDataSet)
  console.log(fileMetaElements.print());

  // 엔티티 객체 생성
  const patient = new Patient(dicomDataSet)
  console.log(patient.print());

  const studies = new Study(dicomDataSet)
  console.log(studies.print());

  const series = new Series(dicomDataSet)
  console.log(series.print());

  const instance = new Instance(dicomDataSet)
  console.log(instance.print());

    return new ParsedData(
        preamble,
        prefix,
        fileMetaElements,
        patient,
        studies,
        series,
        instance
    )
}

export default dicomParseDataSet;


// const data = parserDicomFile(dicomFilePath)
// console.log(data.preamble.print())
// console.log(data.prefix.print())
