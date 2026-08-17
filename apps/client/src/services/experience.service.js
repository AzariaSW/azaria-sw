import { get, put, post, remove } from "../api/request";

export function getExperiences(params = {}) {
  return get("/experiences",{
    params,
  });
}

export function getExperience(id) {
  return get(`/experiences/${id}`);
}

export function getExperienceRoles() {
  return get("experiences/roles");
}

export async function createExperience(data) {
  return post("/experiences", data);
}

export async function updateExperience(id, data) {
  return put(`/experiences/${id}`, data);
}

export async function removeExperience(id) {
  return remove(`/experiences/${id}`);
}