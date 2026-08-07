import { post } from "../api/request";

export async function submitChallenge(sequence) {
  return post("/auth/challenge", {
    sequence,
  });
}
