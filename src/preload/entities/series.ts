import { DataSet } from 'dicom-parser';
import { Instance } from './instance';

export class Series {
    private dataSet: DataSet;
    private instanceList: Instance[];

    constructor(dataSet: DataSet) {
        this.dataSet = dataSet;
        this.instanceList = this.extractInstances();
    }

    private extractInstances(): Instance[] {
        const instanceList: Instance[] = [];
        const sopInstanceUIDs: Set<string> = new Set();

        Object.keys(this.dataSet.elements).forEach(tag => {
            if (tag === 'x00080018') { // SOPInstanceUID 태그
                const sopInstanceUID = this.dataSet.string(tag);
                if (sopInstanceUID && !sopInstanceUIDs.has(sopInstanceUID)) {
                    sopInstanceUIDs.add(sopInstanceUID);
                    instanceList.push(new Instance(this.dataSet));
                }
            }
        });

        return instanceList;
    }

    get seriesInstanceUID(): string {
        return this.dataSet.string('x0020000e') || '';
    }

    get seriesNumber(): string {
        return this.dataSet.string('x00200011') || '';
    }

    get modality(): string {
        return this.dataSet.string('x00080060') || '';
    }

    get instances(): Instance[] {
        return this.instanceList;
    }

    print(): string {
        const results: string[] = [];
        results.push(`    SeriesInstanceUID: ${this.seriesInstanceUID}`);
        results.push(`    SeriesNumber: ${this.seriesNumber}`);
        results.push(`    Modality: ${this.modality}`);
        results.push('    Instances:');
        this.instances.forEach(instance => instance.print());

        return results.join('\n');
    }
}