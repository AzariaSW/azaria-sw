import prisma from "../prisma/client.js";

import ApiError from "../utils/ApiError.js";
import { HTTP_STATUS } from "../constants/httpStatus.js";
import { queryBuilder } from "./query.service.js";

export async function getAllSkills(query) {
  const where = {};

  if (query.category) {
    where.category = query.category;
  }

  if (query.search) {
    where.OR = [
      {
        name: {
          contains: query.search,

          mode: "insensitive",
        },
      },
    ];
  }

  return queryBuilder({
    model: prisma.skill,

    query,

    where,

    allowedSortFields: ["name", "category", "createdAt", "level"],

    defaultSort: [{ category: "asc" }, { name: "asc" }]
  });
}

export async function getSkill(id) {
  const skill = await prisma.skill.findUnique({
    where: { id },
  });

  if (!skill) {
    throw new ApiError(
      HTTP_STATUS.NOT_FOUND,

      "Skill not found",
    );
  }

  return skill;
}

export async function getSkillCategories() {
  const result = await prisma.skill.findMany({
    distinct: ["category"],

    select: {
      category: true,
    },

    orderBy: {
      category: "asc",
    },
  });

  return result.map((item) => item.category);
}

export async function createSkill(data) {
  return prisma.skill.create({
    data,
  });
}

export async function updateSkill(data, skillId) {
  try {
    return await prisma.skill.update({
      where: {
        id: skillId,
      },
      data,
    });
  } catch (error) {
    if (error.code === "P2025") {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Skill not found");
    }
    throw error;
  }
}

export async function deleteSkill(skillId) {
  try {
    return await prisma.skill.delete({
      where: {
        id: skillId,
      },
    });
  } catch (error) {
    if (error.code === "P2025") {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "Skill not found");
    }

    throw error;
  }
}
