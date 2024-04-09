/** user entered search criteria to send to API */
export interface SearchCriteria {
    keyword: string;
    cveId: string;
    limitCount: number;
    startDate: string;
    endDate: string;
    product: string;
    vdoLabels: Array<string>;
    cvssScores: Array<number>;
}