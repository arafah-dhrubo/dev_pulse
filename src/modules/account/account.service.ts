import { AccountModel } from "./account.model";
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";
import { SignupDto, SignupResult } from "@/modules/account/account.types";

export class AccountService {

    static async signupAccount(data: SignupDto): Promise<SignupResult> {
        const existingAccount = await AccountModel.findAccountByEmail(data.email);
        if (existingAccount) {
            throw new Error("Account already exists");
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        try {
            await AccountModel.createAccount({ ...data, role: data.role ?? 'contributor', password: hashedPassword });
            return { name: data.name, email: data.email, role: data.role ?? 'contributor' };
        } catch (error) {
            console.log("Account creation failed", error);
            throw error;
        }
    }

    static async loginAccount(email: string, password: string) {
        const existingAccount = await AccountModel.findAccountByEmail(email);
        if (!existingAccount) {
            throw new Error("Account not found");
        }

        const isPasswordValid = await bcrypt.compare(password, existingAccount.password);
        if (!isPasswordValid) {
            throw new Error("Invalid password");
        }

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('JWT secret is not defined');
        }
        const accessToken = jwt.sign(
            {
                id: existingAccount.id,
                role: existingAccount.role,
                name: existingAccount.name
            },
            secret,
            {
                expiresIn: '1h'
            }
        );

        return {
            token: accessToken,
            user: {
                id: existingAccount.id,
                name: existingAccount.name,
                email: existingAccount.email,
                role: existingAccount.role,
                createdAt: existingAccount.created_at,
                updatedAt: existingAccount.updated_at
            }
        }
    }
}