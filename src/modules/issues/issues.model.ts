import { pool } from "@/config/db";
import { IssueData, IssueQueryParams } from "./issues.types";

export class IssuesModel {
    static async init() {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS issues (
                id SERIAL PRIMARY KEY,
                title VARCHAR(150) NOT NULL,
                description TEXT NOT NULL CHECK (char_length(description) >= 20),
                type VARCHAR(20) NOT NULL CHECK (type IN ('bug', 'feature_request')),
                status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved')),
                reporter_id INT REFERENCES accounts(id) ON DELETE CASCADE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `)
    }

    static async getAllIssues(params: IssueQueryParams) {
        const conditions: string[] = [];
        const values: any[] = [];

        if (params.type) {
            values.push(params.type);
            conditions.push(`type = $${values.length}`);
        }

        if (params.status) {
            values.push(params.status);
            conditions.push(`status = $${values.length}`);
        }

        const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
        const order = params.sort === 'oldest' ? 'ASC' : 'DESC';

        const query = `SELECT * FROM issues ${where} ORDER BY created_at ${order}`;
        const result = await pool.query(query, values);
        return result.rows;
    }

    static async findReportersByIds(ids: number[]) {
        if (ids.length === 0) return [];
        const query = `SELECT id, name, role FROM accounts WHERE id = ANY($1)`;
        const result = await pool.query(query, [ids]);
        return result.rows;
    }

    static async getIssueById(id: number){
        const query = `SELECT * FROM issues WHERE id = $1`;
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }

    static async createIssue(data: IssueData) {
        const query = `
            INSERT INTO issues (title, description, type, status, reporter_id)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;
        const values = [data.title, data.description, data.type, data.status || 'open', data.reporter_id];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    static async updateIssue(id: number, data: IssueData) {
        const query = `
            UPDATE issues
            SET title = $1, description = $2, type = $3, status = $4, updated_at = CURRENT_TIMESTAMP
            WHERE id = $5
            RETURNING *;
        `;
        const values = [data.title, data.description, data.type, data.status, id];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    static async deleteIssue(id: number){
        const query = `
            DELETE FROM issues
            WHERE id = $1
            RETURNING *;
        `;
        const values = [id];
        const result = await pool.query(query, values);
        return result.rows[0];
    }
}