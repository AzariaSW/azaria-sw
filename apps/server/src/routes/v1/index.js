import { Router } from "express";

import healthRoutes from "../health.routes.js";
import projectRoutes from "../project.routes.js";
import profileRoutes from "../profile.routes.js";
import skillRoutes from "../skill.routes.js";
import githubRoutes from "../github.routes.js";
import authRoutes from "../auth.routes.js";
import experienceRoutes from "../experience.routes.js";
import educationRoutes from "../education.routes.js";
import certificateRoutes from "../certificate.routes.js";
import messageRoutes from "../message.routes.js";


const router = Router();

router.use("/health", healthRoutes);

router.use("/projects", projectRoutes);

router.use("/profile", profileRoutes);

router.use("/skills", skillRoutes);

router.use("/github", githubRoutes);

router.use("/auth", authRoutes);

router.use("/experiences", experienceRoutes);

router.use("/education", educationRoutes);

router.use("/certificates", certificateRoutes);

router.use("/messages", messageRoutes);

export default router;