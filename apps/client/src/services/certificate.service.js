import { get, put, post, remove } from "../api/request";
import toFormData from "../utils/formData";

export function getCertificates(params = {}) {
  return get("/certificates",{
    params,
  });
}

export function getCertificate(id) {
  return get(`/certificates/${id}`);
}

export async function createCertificate(data) {
  return post("/certificates", toFormData(data));
}

export async function updateCertificate(id, data) {
  return put(`/certificates/${id}`, toFormData(data));
}

export async function removeCertificate(id) {
  return remove(`/certificates/${id}`);
}