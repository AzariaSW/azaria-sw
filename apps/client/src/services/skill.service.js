import { get, put, post, remove } from "../api/request";

export function getSkills(params = {}) {
  return get("/skills",{
    params,
  });
}

export function getSkill(id) {
  return get(`/skills/${id}`);
}

export function getSkillCategories() {
  return get("skills/categories");
}

export async function createSkill(data) {
  return post("/skills", data);
}

export async function updateSkill(id, data) {
  return put(`/skills/${id}`, data);
}

export async function removeSkill(id) {
  return remove(`/skills/${id}`);
}