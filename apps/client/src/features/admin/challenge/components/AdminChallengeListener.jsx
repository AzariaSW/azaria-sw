import { useState, useRef, useEffect } from "react";

import useAdminChallenge from "../hooks/useAdminChallenge";

export default function AdminChallengeListener({ onChallengeSuccess }) {
  const [isListening, setIsListening] = useState(false);
  const [sequence, setSequence] = useState("");
  const sequenceRef = useRef("");

  const challenge = useAdminChallenge({
    onSuccess: (data) => {
      onChallengeSuccess(data.challengeToken);
    },
  });

  useEffect(() => {
    if (!isListening) {
      return;
    }

    function handleKeyDown(event) {
      if (event.key === "Backspace"){
        sequenceRef.current = sequenceRef.current.slice(0, -1);
        setSequence(sequenceRef.current);
      }

      if (event.key === "Enter") {
        const currentSequence = sequenceRef.current;

        sequenceRef.current = "";
        setSequence("");

        if (!currentSequence) {
          return;
        }

        challenge.mutate(currentSequence);
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
  }, [isListening, challenge]);
  return (
    <>
      <button onClick={() => setIsListening(true)}>
        Activate Admin Challenge
      </button>
      <p>{isListening ? "Listening..." : "Not listening"}</p>
      <p>Sequence: {sequence}</p>
    </>
  );
}
