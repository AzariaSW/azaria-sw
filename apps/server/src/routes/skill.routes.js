import { Router } from "express";

import validate from "../middleware/validate.js";

import {
  getAllSkills,
  getSkill,
  getSkillCategories,
  createSkill,
  updateSkill,
  deleteSkill,
} from "../controllers/skill.controller.js";

import authenticateAdmin from "../middleware/authenticateAdmin.js";

import {
  skillSchema,
  updateSkillSchema,
  idSchema,
} from "../validators/skill.validator.js";

const router = Router();

router.get("/", getAllSkills);

router.get("/categories", getSkillCategories);

router.get("/:id", validate(idSchema), getSkill);

router.post("/", authenticateAdmin, validate(skillSchema), createSkill);

router.put("/:id", authenticateAdmin, validate(updateSkillSchema), updateSkill);

router.delete("/:id", authenticateAdmin, validate(idSchema), deleteSkill);

export default router;
