import { Request, Response } from "express";
import { IssuesService } from "./issues.service";
import { ISSUE_TYPES, ISSUE_STATUSES } from "./issues.constants";
import { IssueQueryParams, IssueUpdateDto } from "./issues.types";

export class IssuesController {
    static async getAllIssues(
        req: Request,
        res: Response
    ): Promise<void> {
        try {
            const { sort, type, status } = req.query as {
                sort?: "newest" | "oldest";
                type?: typeof ISSUE_TYPES[number];
                status?: typeof ISSUE_STATUSES[number];
            };
            const errors: string[] = [];

            if (type && !ISSUE_TYPES.includes(type)) {
                errors.push(
                    `Invalid type. Must be one of: ${ISSUE_TYPES.join(", ")}`
                );
            }

            if (status && !ISSUE_STATUSES.includes(status)) {
                errors.push(
                    `Invalid status. Must be one of: ${ISSUE_STATUSES.join(", ")}`
                );
            }

            if (sort && sort !== "newest" && sort !== "oldest") {
                errors.push(
                    "Invalid sort. Must be newest or oldest"
                );
            }

            if (errors.length) {
                res.error(errors[0], 400);
                return;
            }

            const params: IssueQueryParams = {
                sort: sort ?? "newest",
                type,
                status,
            };

            const data = await IssuesService.getAllIssues(params);

            res.success(data);
        } catch (error) {
            console.error("Failed to get issues", error);

            res.error((error as Error).message);
        }
    }

    static async createIssue(req: Request, res: Response): Promise<void> {
        try {
            const { type } = req.body;

            if (!type || !ISSUE_TYPES.includes(type)) {
                res.error(`Invalid or missing type. Must be one of: ${ISSUE_TYPES.join(', ')}`, 400);
                return;
            }

            const issue = await IssuesService.createIssue(req.body, req.user!.id);
            res.success(issue, 'Issue created successfully', 201);
        } catch (error) {
            console.error('Failed to create issue', error);
            res.error((error as Error).message);
        }
    }

    static async issueDetail(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id as string, 10);
            if (isNaN(id)) {
                res.error('Invalid issue ID', 400);
                return;
            }
            const issue = await IssuesService.getIssueById(id);
            if (!issue) {
                res.error('Issue not found', 404);
                return;
            }
            res.success(issue);
        } catch (error) {
            console.error('Failed to get issue', error);
            res.error((error as Error).message);
        }
    }

    static async updateIssue(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id as string, 10);
            if (isNaN(id)) {
                res.error('Invalid issue ID', 400);
                return;
            }

            const { type, status } = req.body;

            if (type && !ISSUE_TYPES.includes(type)) {
                res.error(`Invalid type. Must be one of: ${ISSUE_TYPES.join(', ')}`, 400);
                return;
            }

            if (status && !ISSUE_STATUSES.includes(status)) {
                res.error(`Invalid status. Must be one of: ${ISSUE_STATUSES.join(', ')}`, 400);
                return;
            }

            const issue = await IssuesService.updateIssue(id, req.body);
            if (!issue) {
                res.error('Issue not found', 404);
                return;
            }
            res.success(issue, 'Issue updated successfully');
        } catch (error) {
            console.error('Failed to update issue', error);
            res.error((error as Error).message);
        }
    }

    static async deleteIssue(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id as string, 10);
            if (isNaN(id)) {
                res.error('Invalid issue ID', 400);
                return;
            }

            const issue = await IssuesService.getIssueById(id);
            if (!issue) {
                res.error('Issue not found', 404);
                return;
            }

            if (issue.reporter?.id !== req.user!.id) {
                res.error('Forbidden: You can only delete your own issues', 403);
                return;
            }

            const deleted = await IssuesService.deleteIssue(id);
            res.success(deleted, 'Issue deleted successfully');
        } catch (error) {
            console.error('Failed to delete issue', error);
            res.error((error as Error).message);
        }
    }
}
