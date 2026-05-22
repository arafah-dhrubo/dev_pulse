import { IssueType, IssueStatus } from "./issues.constants";

export interface IssueCreateDto {
    title: string;
    description: string;
    type: IssueType;
    status: IssueStatus;
}

export interface IssueData extends IssueCreateDto {
    reporter_id: number;
}

export interface IssueQueryParams {
    sort?: 'newest' | 'oldest';
    type?: IssueType;
    status?: IssueStatus;
}

export interface IssueUpdateDto {
    title?: string;
    description?: string;
    type?: IssueType;
    status?: IssueStatus;
}