import { BaseEntity } from './base-entity';

export interface EoiStudent extends BaseEntity {
    projectId: string;
    businessId: string;
    isNew: boolean;
    studyArea: string;
    why: string;
    commitment: string;
    resumeUrl: string;
    transcriptUrl: string;
    submittedOn?: Date;
}
