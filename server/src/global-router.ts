import { Router } from "express";
import authRouter from "./auth/auth-router";
import screenshotRouter from "./screenshot-router";

const globalRouter = Router();

globalRouter.use(authRouter);
globalRouter.use("/screenshot", screenshotRouter);

export default globalRouter;
