import { DataSet } from 'dicom-parser';
import { Series } from './series';

export class Study {
    private dataSet: DataSet;
    private seriesList: Series[];
    private studyInstanceUID: string;
    private studyDate: string;
    private studyTime: string;
    private modality: string;
    private referringPhysicianName: string;
    private studyID: string;
    private accessionNumber: string;
    private patientAge: string;
    private patientSize: string;
    private patientWeight: string;
    private description: string;

    constructor(dataSet: DataSet) {
        this.dataSet = dataSet;
        this.seriesList = this.extractSeries();
        this.studyInstanceUID = this.dataSet.string('x0020000d') || '';
        this.studyDate = this.dataSet.string('x00080020') || '';
        this.studyTime = this.dataSet.string('x00080030') || '';
        this.modality = this.dataSet.string('x00080060') || '';
        this.referringPhysicianName = this.dataSet.string('x00080090') || '';
        this.studyID = this.dataSet.string('x00200010') || '';
        this.accessionNumber = this.dataSet.string('x00080050') || '';
        this.patientAge = this.dataSet.string('x00101010') || '';
        this.patientSize = this.dataSet.string('x00101020') || '';
        this.patientWeight = this.dataSet.string('x00101030') || '';
        this.description = this.dataSet.string('x00081030') || '';
    }

    private extractSeries(): Series[] {
        const seriesList: Series[] = [];
        const seriesInstanceUIDs: Set<string> = new Set();

        Object.keys(this.dataSet.elements).forEach(tag => {
            if (tag === 'x0020000e') { // SeriesInstanceUID 태그
                const seriesInstanceUID = this.dataSet.string(tag);
                if (seriesInstanceUID && !seriesInstanceUIDs.has(seriesInstanceUID)) {
                    seriesInstanceUIDs.add(seriesInstanceUID);
                    seriesList.push(new Series(this.dataSet));
                }
            }
        });

        return seriesList;
    }

    getStudyInstanceUID(): string {
        return this.studyInstanceUID;
    }

    getStudyDate(): string {
        return this.studyDate;
    }

    getStudyTime(): string {
        return this.studyTime;
    }

    getModality(): string {
        return this.modality;
    }

    getReferringPhysicianName(): string {
        return this.referringPhysicianName;
    }

    getStudyID(): string {
        return this.studyID;
    }

    getAccessionNumber(): string {
        return this.accessionNumber;
    }

    getPatientAge(): string {
        return this.patientAge;
    }

    getPatientSize(): string {
        return this.patientSize;
    }

    getPatientWeight(): string {
        return this.patientWeight;
    }

    getDescription(): string {
        return this.description;
    }

    getSeriesList(): Series[] {
        return this.seriesList;
    }

    print(): string {
        const results: string[] = [];
        results.push(`  StudyInstanceUID: ${this.getStudyInstanceUID()}`);
        results.push(`  StudyDate: ${this.getStudyDate()}`);
        results.push(`  StudyTime: ${this.getStudyTime()}`);
        results.push(`  Modality: ${this.getModality()}`);
        results.push(`  ReferringPhysicianName: ${this.getReferringPhysicianName()}`);
        results.push(`  StudyID: ${this.getStudyID()}`);
        results.push(`  AccessionNumber: ${this.getAccessionNumber()}`);
        results.push(`  PatientAge: ${this.getPatientAge()}`);
        results.push(`  PatientSize: ${this.getPatientSize()}`);
        results.push(`  PatientWeight: ${this.getPatientWeight()}`);
        results.push(`  Description: ${this.getDescription()}`);
        results.push('  Series:');
        this.getSeriesList().forEach(series => series.print());
        
        return results.join('\n');
    }
}