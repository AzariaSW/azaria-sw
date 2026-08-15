import { get, put, post, remove } from "../api/request";

export function getEducations(params = {}) {
  return get("/education", {
    params,
  });
}

export function getEducation(id) {
  return get(`/education/${id}`);
}

export async function createEducation(data) {
  return post("/education", data);
}

export async function updateEducation(id, data) {
  return put(`/education/${id}`, data);
}

export async function removeEducation(id) {
  return remove(`/education/${id}`);
}
