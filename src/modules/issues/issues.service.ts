import { IssuesModel } from "./issues.model";
import { IssueCreateDto, IssueData, IssueQueryParams, IssueUpdateDto } from "./issues.types";

export class IssuesService {
    static async getAllIssues(params: IssueQueryParams) {
        const issues = await IssuesModel.getAllIssues(params);

        if (issues.length === 0) return [];

        const reporterIds = [...new Set<number>(issues.map((i) => i.reporter_id))];
        const reporters = await IssuesModel.findReportersByIds(reporterIds);

        const reporterMap = new Map(reporters.map((r) => [r.id, r]));

        return issues.map((issue) => ({
            id: issue.id,
            title: issue.title,
            description: issue.description,
            type: issue.type,
            status: issue.status,
            reporter: reporterMap.get(issue.reporter_id) ?? null,
            created_at: issue.created_at,
            updated_at: issue.updated_at,
        }));
    }

    static async getIssueById(id: number) {
        const issue = await IssuesModel.getIssueById(id);
        if (!issue) return null;
        const reporter = await IssuesModel.findReportersByIds([issue.reporter_id]);
        const reporterInfo = reporter[0] ?? null;
        return {
            id: issue.id,
            title: issue.title,
            description: issue.description,
            type: issue.type,
            status: issue.status,
            reporter: reporterInfo,
            created_at: issue.created_at,
            updated_at: issue.updated_at,
        };
    }

    static async createIssue(data: IssueCreateDto, reporterId: number) {
        // Combine DTO with reporter id
        const issueData: IssueData = { ...data, reporter_id: reporterId };
        const created = await IssuesModel.createIssue(issueData);
        return created;
    }

    static async updateIssue(id: number, data: Partial<IssueUpdateDto>) {
        const existing = await IssuesModel.getIssueById(id);
        if (!existing) return null;
        const merged: IssueData = {
            title: data.title ?? existing.title,
            description: data.description ?? existing.description,
            type: data.type ?? existing.type,
            status: data.status ?? existing.status,
            reporter_id: existing.reporter_id,
        };
        return await IssuesModel.updateIssue(id, merged);
    }

    static async deleteIssue(id: number) {
        return await IssuesModel.deleteIssue(id);
    }
}
