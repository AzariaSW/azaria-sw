import { MapPin, Briefcase, Languages, Target } from "../../../lib/icons";
import Icon from "../../../lib/icons/Icon";
import { Section } from "../../../components/layout";
import useProfile from "../../profile/hooks/useProfile";
import { Skeleton } from "../../../components/feedback";
import { Card, Reveal } from "../../../components/common";
import "./About.css";

export default function About() {
  const { data: profile, isLoading, isError } = useProfile();

  if (isLoading) {
    return <Skeleton />;
  }

  if (isError) {
    return (
      <section id="about" className="failed">
        Failed to load About information.
      </section>
    );
  }

  const { bio, location, availability } = profile || {};
  const highlights = [
    {
      icon: MapPin,
      title: "Location",
      value: location || "Addis Ababa, Ethiopia",
    },
    {
      icon: Briefcase,
      title: "Availability",
      value: availability || "Open to opportunities",
    },
    {
      icon: Languages,
      title: "Languages",
      value: "Amharic, English",
    },
    {
      icon: Target,
      title: "Interests",
      value: `Backend | Cloud | System Design`,
    },
  ];
  return (
    <Reveal>
      <section id="about">
        <Section title="About Me" description="Get to know me better.">
          <div className="about">
            <div className="about__content">
              <h3 className="about__heading">Who I Am</h3>

              <p className="about__bio">
                {bio ||
                  "I am a Software Engineering student passionate about backend development, scalable applications, and building software that solves real-world problems."}
              </p>

              <p className="about__bio">
                I enjoy learning modern technologies, improving my engineering
                skills, and creating clean, maintainable systems that makes a
                positive impact.
              </p>
            </div>

            <div className="about__cards">
              {highlights.map(({ icon, title, value }) => (
                <Card key={title} className="about__card">
                  <Icon icon={icon} className="about__card-icon" />

                  <h4 className="about__card-title">{title}</h4>

                  <p className="about__card-value">{value}</p>
                </Card>
              ))}
            </div>
          </div>
        </Section>
      </section>
    </Reveal>
  );
}
