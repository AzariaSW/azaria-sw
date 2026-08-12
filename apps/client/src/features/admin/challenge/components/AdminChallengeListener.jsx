import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import useAdminChallenge from "../hooks/useAdminChallenge";

export default function AdminChallengeListener({ isActive }) {
  const [sequence, setSequence] = useState("");
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
        setSequence(sequenceRef.current);
        return;
      }

      if (event.key === "Enter") {
        const currentSequence = sequenceRef.current;

        sequenceRef.current = "";
        setSequence("");

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
        setSequence(sequenceRef.current);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isActive, challenge]);
  return (
    <>
      <p>Sequence: {sequence}</p>
    </>
  );
}
