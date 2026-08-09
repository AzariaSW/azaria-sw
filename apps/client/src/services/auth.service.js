import { post } from "../api/request";

export async function submitChallenge(sequence) {
  return post("/auth/challenge", {
    sequence,
  });
}

export async function login(data, token) {
  return post("/auth/login", data, {
    headers: {
    "X-Admin-Challenge": token
  }});
}
