import { Request, Response } from "express";
import { AccountService } from "./account.service";

export class AccountController {
    static async signupAccount(req: Request, res: Response) {
        try {
            const user = await AccountService.signupAccount(req.body);
            (res as any).success(user, 'Account created successfully', 201);
        } catch (error) {
            console.error("Account registration failed", error);
            (res as any).error((error as Error).message);
        }
    }

    static async loginAccount(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            const result = await AccountService.loginAccount(email, password);
            (res as any).success(result, 'Login successful', 200);
        } catch (error) {
            console.error("Login failed", error);
            (res as any).error((error as Error).message, 401);
        }
    }
}