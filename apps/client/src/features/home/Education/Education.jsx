import { Section } from "../../../components/layout";
import { Card } from "../../../components/common";
import { Skeleton } from "../../../components/feedback";
import { Reveal } from "../../../components/common";

import useEducation from "../../education/hooks/useEducation";

import formatDateRange from "../../../utils/formatDateRange";

import "./Education.css";

export default function Education() {
  const { data: education = {}, isLoading, isError } = useEducation();

  const { items = [] } = education;

  if (isLoading) {
    return <Skeleton />;
  }

  if (isError) {
    return (
      <section id="education" className="failed">
        Failed to load education.
      </section>
    );
  }

  if (!items.length) {
    return null;
  }

  return (
    <section id="education">
      <Section
        title="Education"
        subtitle="My academic journey."
      >
        <div className="education">
          {items.map((item, index) => (
            <Reveal
              key={item.id}
              delay={index * 0.08}
            >
              <Card className="education__card">
                <div className="education__header">
                  <div>
                    <h3>{item.degree}</h3>

                    <h4>{item.institution}</h4>
                  </div>

                  <span className="education__date">
                    {formatDateRange(
                      item.startDate,
                      item.endDate
                    )}
                  </span>
                </div>

                {item.fieldOfStudy && (
                  <p className="education__field">
                    {item.fieldOfStudy}
                  </p>
                )}

                {item.description && (
                  <p>{item.description}</p>
                )}

                {item.grade && (
                  <span className="education__grade">
                    Grade: {item.grade}
                  </span>
                )}
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>
    </section>
  );
}