import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import childrenRouter from "./children";
import conversationsRouter from "./conversations";
import messagesRouter from "./messages";
import contactsRouter from "./contacts";
import alertsRouter from "./alerts";
import dashboardRouter from "./dashboard";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(childrenRouter);
router.use(conversationsRouter);
router.use(messagesRouter);
router.use(contactsRouter);
router.use(alertsRouter);
router.use(dashboardRouter);

export default router;
