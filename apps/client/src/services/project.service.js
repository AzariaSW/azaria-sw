import { get, put, post, remove } from "../api/request";
import toFormData from "../utils/formData";

export function getProjects(params = {}) {
  return get("/projects",{
    params,
  });
}

export function getProject(id) {
  return get(`/projects/${id}`);
}

export async function createProject(data) {
  return post("/projects", toFormData(data));
}

export async function updateProject(id, data) {
  return put(`/projects/${id}`, toFormData(data));
}

export async function removeProject(id) {
  return remove(`/projects/${id}`);
}