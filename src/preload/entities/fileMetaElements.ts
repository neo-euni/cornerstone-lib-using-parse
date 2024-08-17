import { DataSet } from 'dicom-parser';

export class FileMetaElements {
    private dataSet: DataSet;
    private fileMetaInformationGroupLength: string;
    private fileMetaInformationVersion: string;
    private mediaStorageSOPClassUID: string;
    private mediaStorageSOPInstanceUID: string;
    private transferSyntaxUID: string;
    private implementationClassUID: string;
    private implementationVersionName: string;

    constructor(dataSet: DataSet) {
        this.dataSet = dataSet;
        this.fileMetaInformationGroupLength = this.dataSet.string('x00020000') || '';
        this.fileMetaInformationVersion = this.dataSet.string('x00020001') || '';
        this.mediaStorageSOPClassUID = this.dataSet.string('x00020002') || '';
        this.mediaStorageSOPInstanceUID = this.dataSet.string('x00020003') || '';
        this.transferSyntaxUID = this.dataSet.string('x00020010') || '';
        this.implementationClassUID = this.dataSet.string('x00020012') || '';
        this.implementationVersionName = this.dataSet.string('x00020013') || '';
    }

    getFileMetaInformationGroupLength = (): string => {
        return this.fileMetaInformationGroupLength;
    };

    getFileMetaInformationVersion = (): string => {
        return this.fileMetaInformationVersion;
    };

    getMediaStorageSOPClassUID = (): string => {
        return this.mediaStorageSOPClassUID;
    };

    getMediaStorageSOPInstanceUID = (): string => {
        return this.mediaStorageSOPInstanceUID;
    };

    getTransferSyntaxUID = (): string => {
        return this.transferSyntaxUID;
    };

    getImplementationClassUID = (): string => {
        return this.implementationClassUID;
    };

    getImplementationVersionName = (): string => {
        return this.implementationVersionName;
    };

    print = (): string => {
        const results: string[] = [];
        results.push(`fileMetaInformationGroupLength: ${this.getFileMetaInformationGroupLength()}`);
        results.push(`fileMetaInformationVersion: ${this.getFileMetaInformationVersion()}`);
        results.push(`mediaStorageSOPClassUID: ${this.getMediaStorageSOPClassUID()}`);
        results.push(`mediaStorageSOPInstanceUID: ${this.getMediaStorageSOPInstanceUID()}`);
        results.push(`transferSyntaxUID: ${this.getTransferSyntaxUID()}`);
        results.push(`implementationClassUID: ${this.getImplementationClassUID()}`);
        results.push(`implementationVersionName: ${this.getImplementationVersionName()}`);
    
        return results.join('\n');
    };
}    
