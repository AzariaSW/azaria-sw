import { get, post, patch, remove } from "../api/request";

export function getMessages() {
  return get("/messages");
}

export function getMessage(id) {
  return get(`/messages/${id}`);
}

export async function sendContactMessage(data) {
  return post("/messages", data);
}

export async function markAsRead(id) {
  return patch(`/messages/${id}`);
}

export async function deleteMessage(id) {
  return remove(`/messages/${id}`);
}