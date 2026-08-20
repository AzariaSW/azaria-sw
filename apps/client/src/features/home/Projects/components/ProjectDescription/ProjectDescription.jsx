import { useEffect, useRef, useState } from "react";

import "./ProjectDescription.css";

export default function ProjectDescription({ description }) {
  const [expanded, setExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);

  const descriptionRef = useRef(null);

  useEffect(() => {
    const element = descriptionRef.current;

    if (!element) {
      return;
    }

    setIsTruncated(element.scrollHeight > element.clientHeight);
  }, [description]);

  return (
    <div className="project__description-wrapper">
      <p
        ref={descriptionRef}
        className={`project__description ${
          expanded ? "project__description--expanded" : ""
        }`}
      >
        {description}
      </p>

      {isTruncated && (
        <button
          type="button"
          className="project__show-more"
          onClick={() => setExpanded((value) => !value)}
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
}