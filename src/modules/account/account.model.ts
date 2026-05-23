import {pool} from '../../config/db'
import { SignupDto } from './account.types';

export class AccountModel {
    static async init(){
        try{
            await pool.query(`
                CREATE TABLE IF NOT EXISTS accounts (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    email VARCHAR(255) NOT NULL UNIQUE,
                    password VARCHAR(255) NOT NULL,
                    role VARCHAR(255) DEFAULT 'contributor',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )`);

        }
        catch(error){
            console.log("Account table creation failed",error);
        }
    }

    static async createAccount(data: SignupDto){
        try{
            const query = `INSERT INTO accounts (name,email,password,role) VALUES ($1,$2,$3,$4)`;
            const values = [data.name,data.email,data.password,data.role];
            await pool.query(query,values);
            console.log("Account created successfully");
        }
        catch(error){
            console.log("Account creation failed",error);
        }
    }

    static async findAccountByEmail(email: string){
        try{
            const query = `SELECT * FROM accounts WHERE email = $1`;
            const result = await pool.query(query,[email]);
            return result.rows[0];
        }
        catch(error){
            console.log("Account not found",error);
        }
    }

    static async updateAccount(data: any){
        try{
            const query = `UPDATE accounts SET name = $1,email = $2,password = $3,role = $4 WHERE id = $5`;
            const values = [data.name,data.email,data.password,data.role,data.id];
            await pool.query(query,values);
            console.log("Account updated successfully");
        }
        catch(error){
            console.log("Account update failed",error);
        }
    }

    static async deleteAccount(id: string){
        try{
            const query = `DELETE FROM accounts WHERE id = $1`;
            const values = [id];
            await pool.query(query,values);
            console.log("Account deleted successfully");
        }
        catch(error){
            console.log("Account deletion failed",error);
        }
    }
}