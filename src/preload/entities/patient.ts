import { DataSet } from 'dicom-parser';
import { Study } from './study';

export class Patient {
    private dataSet: DataSet;
    private studyList: Study[];
    private patientId: string;
    private name: string;
    private birthDate: string;
    private sex: string;

    constructor(dataSet: DataSet) {
        this.dataSet = dataSet;
        this.studyList = this.extractStudies();
        this.patientId = this.dataSet.string('x00100020') || '';
        this.name = this.dataSet.string('x00100010') || '';
        this.birthDate = this.dataSet.string('x00100030') || '';
        this.sex = this.dataSet.string('x00100040') || '';
    }
    
    extractStudies = (): Study[] => {
        const studyList: Study[] = [];
        const studyInstanceUIDs: Set<string> = new Set();
        // console.log('DataSet elements:', this.dataSet.elements);
    
        Object.keys(this.dataSet.elements).forEach(tag => {            
            if (tag === 'x0020000d') { // StudyInstanceUID 태그
                const studyInstanceUID = this.dataSet.string(tag);
                if (studyInstanceUID && !studyInstanceUIDs.has(studyInstanceUID)) {
                    studyInstanceUIDs.add(studyInstanceUID);
                    studyList.push(new Study(this.dataSet));
                }
            }
        });
    
        return studyList;
    };


    

    getPatientId = (): string => {
        return this.patientId;
    }

    getName = (): string => {
        return this.name;
    }

    getBirthDate = (): string => {
        return this.birthDate;
    }

    getSex = (): string => {
        return this.sex;
    }

    getStudies = (): Study[] => {
        return this.studyList;
    }

    print = (): string =>{
        const results: string[] = [];
        results.push(`Patient ID: ${this.getPatientId()}`);
        results.push(`Patient Name: ${this.getName()}`);
        results.push(`Patient Birth Date: ${this.getBirthDate()}`);
        results.push(`Patient Sex: ${this.getSex()}`);
        results.push('Studies:');
        this.getStudies().forEach(study => study.print());

        return results.join('\n');
    }
}