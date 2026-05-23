import { Router } from "express";
import { IssuesController } from "./issues.controller";
import { authenticateUser } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/role.middleware";

const router = Router();

router.use(authenticateUser);

router.get("/", IssuesController.getAllIssues);
router.get("/:id", IssuesController.issueDetail);
router.post("/", IssuesController.createIssue);
router.patch("/:id", IssuesController.updateIssue);
router.delete("/:id", IssuesController.deleteIssue);

export default router;
