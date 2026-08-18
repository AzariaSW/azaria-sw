import { ArrowRight, Download, Dot } from "../../../lib/icons";
import Icon from "../../../lib/icons/Icon";
import useProfile from "../../profile/hooks/useProfile";
import HERO_STACK from "../../../constants/hero.js";
import { Button, SocialLinks, Reveal } from "../../../components/common";
import { Skeleton } from "../../../components/feedback";
import { getAsset } from "../../../utils/getAsset";
import "./Hero.css";

export default function Hero() {
  const { data: profile, isLoading, isError } = useProfile();
  const {
    fullName,
    title,
    bio,
    github,
    linkedin,
    email,
    phone,
    telegram,
    resumeUrl,
    cvUrl,
    profileImage,
  } = profile ?? {};

  if (isLoading) {
    return <Skeleton />;
  }

  if (isError) {
    return (
      <section id="hero" className="failed">
        Failed to load profile.
      </section>
    );
  }

  return (
    <section id="hero">
      <div className="hero">
        <Reveal>
          <div className="hero__content">
            <p className="hero__greeting">Hello, I'm</p>

            <h1 className="hero__name">{fullName || "Azaria Abenet Fitta"}</h1>

            <p className="hero__role">{title || "Software Engineer"}</p>

            <p className="hero__description">
              {bio ??
                "I build scalable web applications with clean architecture, modern technologies, and a strong focus on performance, maintainability, and user experience."}
            </p>

            <div className="hero__actions">
              <Button as="a" href="#projects">
                View Projects <Icon icon={ArrowRight} size="sm" />
              </Button>

              <Button
                as="a"
                href={getAsset(resumeUrl)}
                target="_blank"
                rel="noopener noreferrer"
                variant="secondary"
              >
                <Icon icon={Download} size="sm" /> Download Resume
              </Button>

              <Button
                as="a"
                href={getAsset(cvUrl)}
                target="_blank"
                rel="noopener noreferrer"
                variant="secondary"
              >
                <Icon icon={Download} size="sm" /> Download CV
              </Button>
            </div>

            <div className="hero__social">
              <SocialLinks
                links={[
                  {
                    platform: "github",
                    url: github,
                  },
                  {
                    platform: "linkedin",
                    url: linkedin,
                  },
                  {
                    platform: "email",
                    url: `mailto:${email}`,
                  },
                  {
                    platform: "whatsapp",
                    url: `https://wa.me/${phone}`,
                  },
                  {
                    platform: "telegram",
                    url: `https://t.me/${telegram}`,
                  },
                ]}
              />
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="hero__image">
            <div className="hero__card">
              <div className="hero__avatar">
                {
                  <img
                    src={
                      getAsset(profileImage) ||
                      "../../../assets/images/ProfesionalPicture.pdf"
                    }
                    alt={fullName || "Profile"}
                    className="hero__image"
                  />
                }
              </div>

              <div className="hero__status">
                <span className="hero__status-dot" />
                <span>Available for Work</span>
              </div>

              <div className="hero__terminal">
                <p className="hero__terminal-path">azaria@sw:~$</p>
                <p>
                  $ whoami
                  <br />
                  {fullName || "Azaria Abenet Fitta"}
                </p>

                <p className="hero__stack">
                  <span>$ stack</span>
                  <br />
                  <span className="hero__stack-list">
                    {HERO_STACK.map((technology, index) => (
                      <span key={technology}>
                        {index > 0 && <Icon icon={Dot} size="lg" />}
                        {technology}
                      </span>
                    ))}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
