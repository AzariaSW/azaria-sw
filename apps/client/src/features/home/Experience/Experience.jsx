import { Section } from "../../../components/layout";
import useExperiences from "../../experience/hooks/useExperiences";
import { Skeleton } from "../../../components/feedback";
import formatDateRange from "../../../utils/formatDateRange";
import { Reveal } from "../../../components/common";
import "./Experience.css";

export default function Experience() {
  const { data: experiences = [], isLoading, isError } = useExperiences();
  const { items } = experiences;

  if (isLoading) {
    return <Skeleton />;
  }

  if (isError) {
    return (
      <section id="experience" className="failed">
        Failed to load experience.
      </section>
    );
  }

  if (!items.length) {
    return (
      <section id="experience">
        <Section title="Experience" description="My professional journey.">
          <p className="experience experience__none">
            No experience available.
          </p>
        </Section>
      </section>
    );
  }

  return (
    <section id="experience">
      <Section
        title="Experience"
        description="My professional journey and the roles that shaped my skills."
      >
        <div className="experience">
          {items.map((experience, index) => (
            <Reveal delay={index * 0.05}>
              <div
                className={`experience__item ${
                  index === items.length - 1 ? "experience__item--last" : ""
                }`}
              >
                <div className="experience__timeline">
                  <span className="experience__dot" />
                </div>

                <div className="experience__content">
                  <div className="experience__header">
                    <h3 className="experience__company">
                      {experience.company}
                    </h3>

                    <p className="experience__role">{experience.role}</p>
                  </div>
                  <p className="experience__date">
                    {formatDateRange(experience.startDate, experience.endDate)}
                  </p>

                  <p className="experience__description">
                    {experience.description}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>
    </section>
  );
}
