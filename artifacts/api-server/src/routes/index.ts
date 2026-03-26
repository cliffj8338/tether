import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import childrenRouter from "./children";
import conversationsRouter from "./conversations";
import messagesRouter from "./messages";
import contactsRouter from "./contacts";
import alertsRouter from "./alerts";
import dashboardRouter from "./dashboard";
import pushRouter from "./push";
import waitlistRouter from "./waitlist";
import analyticsRouter from "./analytics";
import adminAnalyticsRouter from "./admin-analytics";
import adminAdvancedRouter from "./admin-advanced";
import adminAiQueryRouter from "./admin-ai-query";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(childrenRouter);
router.use(conversationsRouter);
router.use(messagesRouter);
router.use(contactsRouter);
router.use(alertsRouter);
router.use(dashboardRouter);
router.use(pushRouter);
router.use(waitlistRouter);
router.use(analyticsRouter);
router.use(adminAnalyticsRouter);
router.use(adminAdvancedRouter);
router.use(adminAiQueryRouter);

export default router;
