import { Router } from "express";
import { AccountController } from "./account.controller";

const router = Router();

router.post("/signup", AccountController.signupAccount);
router.post("/login", AccountController.loginAccount);

export default router;
