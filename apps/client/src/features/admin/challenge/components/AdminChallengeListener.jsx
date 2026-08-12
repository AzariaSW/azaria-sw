import { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import useAdminChallenge from "../hooks/useAdminChallenge";

export default function AdminChallengeListener({ isActive }) {
  const sequenceRef = useRef("");

  const navigate = useNavigate();

  const challenge = useAdminChallenge({
    onSuccess: (data) => {
      navigate("/admin", {
        state: {
          challengeToken: data.challengeToken,
        },
      });
    },
  });

  useEffect(() => {
    if (!isActive) {
      return;
    }

    function handleKeyDown(event) {
      if (event.key === "Backspace") {
        sequenceRef.current = sequenceRef.current.slice(0, -1);
        return;
      }

      if (event.key === "Enter") {
        const currentSequence = sequenceRef.current;

        sequenceRef.current = "";

        if (!currentSequence) {
          return;
        }

        challenge.mutate({
          sequence: currentSequence,
        });
        return;
      }

      if (event.key.length === 1) {
        sequenceRef.current += event.key;
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isActive, challenge]);
  return null;
}
